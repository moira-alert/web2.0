// @flow
export const MoiraServiceStates = {
    OK: "OK",
    ERROR: "ERROR",
};

export type NotifierState = {|
    state: $Keys<typeof MoiraServiceStates>,
    message?: string,
|};
