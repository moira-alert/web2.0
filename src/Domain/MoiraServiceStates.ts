import { OverrideField } from "../helpers/OverrideField";
import { DtoNotifierState, DtoNotifierStateForSource } from "./__generated__/data-contracts";

enum MoiraServiceStates {
    OK = "OK",
    ERROR = "ERROR",
}

export { MoiraServiceStates as default };

export type NotifierState = OverrideField<DtoNotifierState, "state", MoiraServiceStates>;

export type NotifierSourceState = OverrideField<
    DtoNotifierStateForSource,
    "state",
    MoiraServiceStates
>;
