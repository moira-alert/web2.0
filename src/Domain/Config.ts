import { ContactTypes } from "./Contact";
import { TMetricSourceCluster } from "./Metric";

export interface ContactConfig {
    type: ContactTypes;
    label: string;
    logo_uri?: string;
    validation?: string;
    placeholder?: string;
    help?: string;
}

export enum ECelebrationMode {
    newYear = "new_year",
}

export interface Config {
    supportEmail: string;
    contacts: Array<ContactConfig>;
    remoteAllowed?: boolean;
    featureFlags: {
        isPlottingDefaultOn: boolean;
        isPlottingAvailable: boolean;
        isSubscriptionToAllTagsAvailable: boolean;
        celebrationMode?: ECelebrationMode;
    };
    metric_source_clusters: TMetricSourceCluster[];
    sentry?: { dsn: string; platform: Platform };
}

export enum Platform {
    DEV = "dev",
    STAGING = "staging",
    PROD = "prod",
}
