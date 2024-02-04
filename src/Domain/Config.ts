import { ContactTypes } from "./Contact";

export interface ContactConfig {
    type: ContactTypes;
    label: string;
    validation?: string;
    placeholder?: string;
    help?: string;
}

export interface Config {
    supportEmail: string;
    contacts: Array<ContactConfig>;
    remoteAllowed?: boolean;
    featureFlags: {
        isPlottingDefaultOn: boolean;
        isPlottingAvailable: boolean;
        isSubscriptionToAllTagsAvailable: boolean;
    };
    sentry?: { dsn: string; platform: Platform };
}

export enum Platform {
    DEV = "dev",
    STAGING = "staging",
    PROD = "prod",
}
