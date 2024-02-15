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

export const ClusterSelect = React.forwardRef<Select<string | null>, IClusterSelectProps>(
    function ClusterSelect(
        { clusterID, metricSourceClusters, triggerSource, error, onChange },
        validationRef
    ) {
        const clusterIDs = metricSourceClusters?.reduce((acc: string[], item) => {
            if (item.trigger_source === triggerSource) {
                acc.push(item.cluster_id);
            }
            return acc;
        }, []);

        return (
            <Select<string | null>
                className={error ? "validationError" : ""}
                ref={validationRef}
                value={clusterID}
                renderItem={(value) => value}
                renderValue={(value) => (!clusterID ? null : value)}
                items={clusterIDs}
                onValueChange={(value: string | null) => onChange({ cluster_id: value })}
            />
        );
    }
);