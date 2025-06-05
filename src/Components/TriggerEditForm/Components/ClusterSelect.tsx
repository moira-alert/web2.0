import React from "react";
import { Select } from "@skbkontur/react-ui";
import TriggerSource, { Trigger } from "../../../Domain/Trigger";
import { TMetricSourceCluster } from "../../../Domain/Metric";

interface IClusterSelectProps {
    metricSourceClusters: TMetricSourceCluster[];
    triggerSource: TriggerSource;
    error?: boolean;
    clusterID?: string | null;
    onChange: (trigger: Partial<Trigger>, targetIndex?: number) => void;
}

type ClusterItem = [string, string];

export const ClusterSelect = React.forwardRef<
    Select<string | null, ClusterItem>,
    IClusterSelectProps
>(function ClusterSelect(
    { clusterID, metricSourceClusters, triggerSource, error, onChange },
    validationRef
) {
    const clusterEntities: ClusterItem[] = metricSourceClusters.reduce((acc, item) => {
        if (item.trigger_source === triggerSource) {
            acc.push([item.cluster_id, item.cluster_name]);
        }
        return acc;
    }, [] as ClusterItem[]);

    const isSelectDisabled = clusterEntities.length === 1;

    const value = isSelectDisabled ? clusterEntities.flat()[0] : clusterID;

    return (
        <Select<string | null, ClusterItem>
            data-tid="Cluster select"
            className={error ? "validationError" : ""}
            ref={validationRef}
            value={value}
            disabled={isSelectDisabled}
            renderItem={(_value, item) => item}
            renderValue={(_value, item) => item}
            items={clusterEntities}
            onValueChange={(value) => onChange({ cluster_id: value })}
        />
    );
});
