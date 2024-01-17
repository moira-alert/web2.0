import MoiraApi from "../Api/MoiraApi";
import { getPlatform, Platform } from "./common";
import * as Sentry from "@sentry/react";

const getDSN = async (api: MoiraApi) => {
    try {
        const { sentry } = await api.getConfig();
        return sentry?.dsn;
    } catch (error) {
        return Promise.reject("Error getting DSN");
    }
};

const isLocalPlatform = getPlatform() === Platform.LOCAL;

export const initSentry = async (api: MoiraApi) => {
    const key = await getDSN(api);
    Sentry.init({
        dsn: key,
        debug: isLocalPlatform,
        environment: getPlatform(),
        enabled: !isLocalPlatform,
        tracesSampleRate: 1.0,
    });
};
