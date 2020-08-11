// @flow
import * as React from "react";
import type { Metric } from "../../../Domain/Metric";
import MobileMetricsListItem from "../MobileMetricsListItem/MobileMetricsListItem";
import cn from "./MobileMetricsList.less";

type Props = {|
    metrics: {
        [metric: string]: Metric,
    },
    onRemove: (metricName: string) => void,
    onSetMaintenance: (metricName: string, maintenance: number) => void,
|};

export default function MobileMetricsList(props: Props): React.Node {
    const { onSetMaintenance, onRemove, metrics } = props;

    return (
        <div className={cn("root")}>
            {Object.keys(metrics).map(x => (
                <MobileMetricsListItem
                    key={x}
                    name={x}
                    value={metrics[x]}
                    onRemove={() => onRemove(x)}
                    onSetMaintenance={interval => onSetMaintenance(x, interval)}
                />
            ))}
        </div>
    );
}
