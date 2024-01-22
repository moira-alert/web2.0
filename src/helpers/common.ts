export function notUndefined<T>(x?: T): x is T {
    return x !== undefined;
}

export const clearInput = (input: string | Array<string>): string => {
    let cleared = Array.isArray(input) ? input.join(" ") : input;

    cleared = cleared.trim();
    cleared = cleared.replace(/[\s]+/g, " ");

    return cleared;
};

export enum Platform {
    LOCAL = "local",
    DEV = "dev",
    STAGING = "staging",
    PROD = "prod",
}

export const getPlatform = (platform: Platform): Platform => {
    if (platform === Platform.PROD) return Platform.PROD;
    if (platform === Platform.DEV) return Platform.DEV;
    if (platform === Platform.STAGING) return Platform.STAGING;
    return Platform.LOCAL;
};
