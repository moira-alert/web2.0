import { Status } from "./Status";
import { MetricItemList } from "./Metric";
import { getUnixTime } from "date-fns";
import { getUTCDate } from "../helpers/DateUtil";
import {
    DtoProblemOfTarget,
    DtoTrigger,
    DtoTriggersList,
    DtoTriggerNoisiness,
    DtoTriggerNoisinessList,
    DtoTriggerCheck,
    DtoTreeOfProblems,
    DtoTriggerCheckResponse,
    MoiraCheckData,
    MoiraTriggerCheck,
} from "./__generated__/data-contracts";
import { OverrideField } from "../helpers/OverrideField";

export type TriggerType = "rising" | "falling" | "expression";
export const DEFAULT_TRIGGER_TYPE = "rising";
export const DEFAULT_TRIGGER_TTL = 600;
export const LOW_TRIGGER_TTL = 300;

export type Trigger = Omit<DtoTrigger, "ttl_state" | "trigger_source" | "trigger_type"> & {
    ttl_state: Status;
    trigger_source: TriggerSource;
    trigger_type: TriggerType;
};

export type CheckData = Omit<MoiraCheckData, "metrics" | "state"> & {
    state: Status;
    metrics: MetricItemList;
};

export type TriggerState = Omit<DtoTriggerCheck, "metrics" | "state"> & {
    state: Status;
    metrics: MetricItemList;
};

export type TriggerCheck = OverrideField<MoiraTriggerCheck, "last_check", CheckData>;

export type TriggerList = OverrideField<DtoTriggersList, "list", TriggerCheck[]>;

export type TriggerWithEvents = DtoTriggerNoisiness;

export type TriggerNoisiness = DtoTriggerNoisinessList;

export enum TriggerTargetProblemType {
    WARN = "warn",
    BAD = "bad",
}

export type TriggerTargetProblem = DtoProblemOfTarget;

export type ValidateTriggerTarget = DtoTreeOfProblems;

export type ValidateTargetsResult = DtoTriggerCheckResponse;

export enum TriggerSource {
    GRAPHITE_LOCAL = "graphite_local",
    GRAPHITE_REMOTE = "graphite_remote",
    PROMETHEUS_REMOTE = "prometheus_remote",
}

export const triggerClientToPayload = (trigger: Trigger | Partial<Trigger>) => {
    switch (trigger.trigger_type) {
        case "expression":
            return {
                ...trigger,
                error_value: null,
                warn_value: null,
            };
        case "rising":
        case "falling":
            return {
                ...trigger,
                expression: "",
            };
        default:
            throw new Error(`Unknown trigger type: ${trigger.trigger_type}`);
    }
};

const checkTreeOfProblemsRecursively = (
    node: TriggerTargetProblem,
    type: TriggerTargetProblemType
): boolean => {
    if (node.type === type) {
        return true;
    }

    return node.problems?.some((node) => checkTreeOfProblemsRecursively(node, type)) ?? false;
};

export const checkTriggerTarget = (
    target: ValidateTriggerTarget | undefined,
    type: TriggerTargetProblemType
): boolean => {
    if (!target) {
        return false;
    } else if (target.tree_of_problems) {
        return checkTreeOfProblemsRecursively(target.tree_of_problems, type);
    } else {
        return !target.syntax_ok;
    }
};

export function triggerSourceDescription(source: TriggerSource): string | undefined {
    switch (source) {
        case TriggerSource.GRAPHITE_REMOTE:
            return "(remote)";
        case TriggerSource.PROMETHEUS_REMOTE:
            return "(prometheus)";
        case TriggerSource.GRAPHITE_LOCAL:
            return undefined;
    }
}

export function maintenanceDelta(maintenance?: number | null): number {
    return (maintenance || 0) - getUnixTime(getUTCDate());
}

export default TriggerSource;
