enum MoiraServiceStates {
    OK = "OK",
    ERROR = "ERROR",
}

export { MoiraServiceStates as default };

export type NotifierState = {
    state: MoiraServiceStates;
    message?: string;
};

export interface NotifierSourceState {
    trigger_source: string;
    cluster_id: string;
    actor: string;
    state: MoiraServiceStates;
    message?: string;
}
