// @flow
export const MoiraStates = {
    OK: "OK",
    ERROR: "ERROR",
};

export type MoiraStatus = {|
    state: $Keys<typeof MoiraStates>,
    message?: string,
|};
