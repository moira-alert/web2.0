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

const platforms: Record<Platform, boolean> = {
    [Platform.LOCAL]: isPlatform(Platform.LOCAL),
    [Platform.DEV]: isPlatform(Platform.DEV),
    [Platform.STAGING]: isPlatform(Platform.STAGING),
    [Platform.PROD]:
        !isPlatform(Platform.LOCAL) && !isPlatform(Platform.DEV) && !isPlatform(Platform.STAGING),
};

export const getPlatform = (): Platform => {
    for (const platform in platforms) {
        if (platforms[platform as Platform]) {
            return platform as Platform;
        }
    }
    throw new Error("No matching platform found");
};
