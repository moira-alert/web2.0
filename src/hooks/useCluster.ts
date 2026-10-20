import { useAppSelector } from "../store/hooks";
import { ConfigState } from "../store/selectors";
import { Trigger, TriggerSource } from "../Domain/Trigger";
import type { IMetricSourceCluster } from "../Domain/Metric";

export const useCluster = (
    trigger: Partial<Trigger>,
    metricSourceClusters?: IMetricSourceCluster[] | null
) => {
    const { config } = useAppSelector(ConfigState);
    const { trigger_source: triggerSource = TriggerSource.GRAPHITE_LOCAL, cluster_id: clusterID } =
        trigger;

    const availableClusters = (metricSourceClusters ?? config?.metric_source_clusters)?.filter(
        (cluster) => cluster.trigger_source === triggerSource
    );

    const cluster =
        availableClusters?.length === 1
            ? availableClusters[0]
            : availableClusters?.find((cluster) => cluster.cluster_id === clusterID);

    return {
        clusterName: cluster?.cluster_name,
        availableClustersCount: availableClusters?.length ?? 0,
        metricsTtl: cluster?.metrics_ttl,
        grafanaUrls: {
            grafanaHost: cluster?.grafana_url,
            grafanaDatasourceId: cluster?.grafana_datasource_id,
        },
    };
};
