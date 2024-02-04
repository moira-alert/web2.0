import MoiraApi from "../Api/MoiraApi";
import * as Sentry from "@sentry/react";

const getDSNConfig = async (api: MoiraApi) => {
    try {
        const res = await api.getConfig();
        return res.sentry;
    } catch (error) {
        return Promise.reject("Error getting DSN");
    }
};

export const initSentry = async (api: MoiraApi) => {
    const config = await getDSNConfig(api);
    if (!config) {
        return;
    }

    const { dsn, platform } = config;
    const isLocalPlatform = platform === undefined;
    Sentry.init({
        dsn,
        debug: isLocalPlatform,
        environment: platform,
        enabled: !isLocalPlatform,
        tracesSampleRate: 1.0,
    });
};
