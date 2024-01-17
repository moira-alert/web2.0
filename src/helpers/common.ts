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

const isPlatform = (platform: Platform): boolean => {
    return window.location.hostname.includes(platform);
};

export const getPlatform = (): Platform => {
    if (isPlatform(Platform.LOCAL)) return Platform.LOCAL;
    if (isPlatform(Platform.DEV)) return Platform.DEV;
    if (isPlatform(Platform.STAGING)) return Platform.STAGING;
    return Platform.PROD;
};
