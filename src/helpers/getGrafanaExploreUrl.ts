import TriggerSource, { Trigger } from "../Domain/Trigger";

export type GrafanaUrls = {
    grafanaHost?: string;
    grafanaDatasourceId?: string;
};

export const getGrafanaExploreUrl = (
    target: string,
    triggerSource: Trigger["trigger_source"],
    grafanaUrls?: GrafanaUrls
): string | undefined => {
    const { grafanaHost, grafanaDatasourceId } = grafanaUrls ?? {};

    if (!grafanaHost || !grafanaDatasourceId) {
        return undefined;
    }

    const query = {
        refId: "A",
        ...(triggerSource === TriggerSource.PROMETHEUS_REMOTE
            ? {
                  expr: target,
                  editorMode: "code",
              }
            : {
                  target,
                  textEditor: true,
              }),
    };

    const params = new URLSearchParams({
        schemaVersion: "1",
        panes: JSON.stringify({
            a: {
                datasource: grafanaDatasourceId,
                queries: [query],
            },
        }),
    });

    return `${grafanaHost.replace(/\/+$/, "")}/explore?${params}`;
};
