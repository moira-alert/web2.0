export const isEmptyString = (str?: string): boolean =>
    str == null || (typeof str === "string" && str.trim().length === 0);
