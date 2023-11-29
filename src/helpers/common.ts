export function notUndefined<T>(x?: T): x is T {
    return x !== undefined;
}

export const clearInput = (input: string | Array<string>): string => {
    let cleared = Array.isArray(input) ? input.join(" ") : input;

    cleared = cleared.trim();
    cleared = cleared.replace(/[\s]+/g, " ");

    return cleared;
};

const domains = {
    local: "localhost",
    dev: ".testkontur.ru",
    staging: "moira-staging.kube.testkontur.ru",
    prod: ".skbkontur.ru",
};

export enum Platform {
    LOCAL = "local",
    DEV = "dev",
    PROD = "prod",
}

export const getPlatformSettings = (): {
    platform: Platform;
} => {
    if (window.location.hostname.includes(domains.local)) {
        return {
            platform: Platform.LOCAL,
        };
    }

    if (window.location.hostname.includes(domains.dev)) {
        return {
            platform: Platform.DEV,
        };
    }

    return {
        platform: Platform.PROD,
    };
};
