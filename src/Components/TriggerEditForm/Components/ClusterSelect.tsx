import React, { FC } from "react";
import { Select } from "@skbkontur/react-ui";
import TriggerSource, { Trigger } from "../../../Domain/Trigger";
import { TMetricSourceCluster } from "../../../Domain/Metric";

interface IClusterSelectProps {
    metricSourceClusters: TMetricSourceCluster[];
    triggerSource: TriggerSource;
    clusterID?: string | null;
    onChange: (trigger: Partial<Trigger>, targetIndex?: number) => void;
}

export const ClusterSelect: FC<IClusterSelectProps> = ({
    clusterID,
    metricSourceClusters,
    triggerSource,
    onChange,
}) => {
    const clusterIDs = metricSourceClusters?.reduce((acc: string[], item) => {
        if (item.trigger_source === triggerSource) {
            acc.push(item.cluster_id);
        }
        return acc;
    }, []);

    return (
        <Select<string | null>
            value={clusterID}
            renderItem={(value) => value}
            renderValue={(value) => (!clusterID ? null : value)}
            items={clusterIDs}
            onValueChange={(value: string | null) => onChange({ cluster_id: value })}
        />
    );
};
