import { Status } from "./Status";
import { MetricItemList } from "./Metric";
import { Schedule } from "./Schedule";

export type TriggerType = "rising" | "falling" | "expression";
export const DEFAULT_TRIGGER_TYPE = "rising";
export const DEFAULT_TRIGGER_TTL = 600;
export const LOW_TRIGGER_TTL = 300;

export type Trigger = {
    notify_about_new_metrics: boolean;
    id: string;
    name: string;
    targets: Array<string>;
    tags: Array<string>;
    patterns: Array<string>;
    expression: string;
    ttl?: number;
    ttl_state: Status;
    throttling: number;
    sched?: Schedule;
    desc?: string;
    trigger_type: TriggerType;
    warn_value: number | null;
    error_value: number | null;
    highlights?: {
        name: string;
    };
    last_check?: {
        state: Status;
        timestamp: number;
        metrics: MetricItemList;
        event_timestamp?: number;
        score: number;
        msg?: string;
        maintenance?: number;
    };
    timestamp?: number;
    is_remote: boolean;
    alone_metrics?: {
        [target_id: string]: boolean;
    };
    mute_new_metrics: boolean;
};

export type TriggerList = {
    list?: Array<Trigger> | null;
    page: number;
    size: number;
    total: number;
};

export type TriggerState = {
    maintenance?: number;
    maintenanceInfo?: {
        setup_user?: string | null;
        setup_time: number;
    };
    metrics: MetricItemList;
    timestamp: number;
    state: Status;
    score: number;
    trigger_id: string;
    msg?: string;
};

export type TriggerTargetProblem = {
    msg: string;
    target: string;
    level: "warn" | "bad";
};

export type ValidateTriggerTarget = TriggerTargetProblem[];

export type ValidateTriggerResult = {
    targets: ValidateTriggerTarget[];
};

enum TriggerDataSources {
    LOCAL = "LOCAL",
    GRAPHITE = "GRAPHITE",
}

export default TriggerDataSources;
