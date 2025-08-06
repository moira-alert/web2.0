import { useEffect } from "react";
import { useGetConfigQuery } from "../../services/BaseApi";
import * as Sentry from "@sentry/react";

export const newStaticErrorText = "Failed to fetch dynamically imported module";

const SentryInitializer = () => {
    const { data: config } = useGetConfigQuery();

    useEffect(() => {
        if (!config?.sentry) {
            return;
        }

        const { dsn, platform } = config.sentry;
        const isLocalPlatform = platform === undefined;
        Sentry.init({
            dsn,
            ignoreErrors: [newStaticErrorText],
            debug: isLocalPlatform,
            environment: platform,
            enabled: !isLocalPlatform,
            tracesSampleRate: 1.0,
        });
    }, [config]);

    return null;
};

export default SentryInitializer;
