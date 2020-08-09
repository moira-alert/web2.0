enum MoiraServiceStates {
    OK = "OK",
    ERROR = "ERROR",
}

export { MoiraServiceStates as default };

export type NotifierState = {
    state: MoiraServiceStates;
    message?: string;
};
