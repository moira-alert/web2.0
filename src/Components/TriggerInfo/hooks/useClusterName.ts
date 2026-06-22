import { useAppSelector } from "../../../store/hooks";
import { ConfigState } from "../../../store/selectors";
import { Trigger } from "../../../Domain/Trigger";

export const useClusterName = (trigger: Trigger) => {
    const { config } = useAppSelector(ConfigState);
    const { trigger_source: triggerSource, cluster_id: clusterID } = trigger;

    const availableClusters = config?.metric_source_clusters?.filter(
        (cluster) => cluster.trigger_source === triggerSource
    );

    const cluster = availableClusters?.find((c) => c.cluster_id === clusterID);

    return {
        clusterName: cluster?.cluster_name,
        availableClustersCount: availableClusters?.length ?? 0,
        metricsTtl: cluster?.metrics_ttl,
    };
};
