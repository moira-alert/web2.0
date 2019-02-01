// @flow
const MoiraServiceStates = {
    OK: "OK",
    ERROR: "ERROR",
};

export { MoiraServiceStates as default };

export type NotifierState = {|
    state: $Keys<typeof MoiraServiceStates>,
    message?: string,
|};
