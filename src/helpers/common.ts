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

export const getPlatformSettings = (): {
    platform: Platform;
} => {
    if (window.location.hostname.includes(Platform.LOCAL)) {
        return {
            platform: Platform.LOCAL,
        };
    }

    if (window.location.hostname.includes(Platform.DEV)) {
        return {
            platform: Platform.DEV,
        };
    }

    if (window.location.hostname.includes(Platform.STAGING)) {
        return {
            platform: Platform.STAGING,
        };
    }

    return {
        platform: Platform.PROD,
    };
};
