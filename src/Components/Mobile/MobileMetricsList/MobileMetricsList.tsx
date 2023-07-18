import * as React from "react";
import { MetricItemList } from "../../../Domain/Metric";
import MobileMetricsListItem from "../MobileMetricsListItem/MobileMetricsListItem";
import cn from "./MobileMetricsList.less";

type Props = {
    metrics: MetricItemList;
    onRemove: (metricName: string) => void;
    onSetMaintenance: (metricName: string, maintenance: number) => void;
    withTargets?: boolean;
};

export default function MobileMetricsList(props: Props): React.ReactElement {
    const { onSetMaintenance, onRemove, metrics, withTargets } = props;

    return (
        <div className={cn("root")}>
            {Object.keys(metrics).map((x) => (
                <MobileMetricsListItem
                    key={x}
                    name={x}
                    value={metrics[x]}
                    onRemove={() => onRemove(x)}
                    onSetMaintenance={(interval) => onSetMaintenance(x, interval)}
                    withTargets={withTargets}
                />
            ))}
        </div>
    );
}
