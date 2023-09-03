import * as React from "react";
import { Metric, MetricItemList } from "../../../Domain/Metric";
import MobileMetricsListItem from "../MobileMetricsListItem/MobileMetricsListItem";
import cn from "./MobileMetricsList.less";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";

type Props = {
    metrics: MetricItemList;
    onRemove: (metricName: string) => void;
    onSetMaintenance: (metricName: string, maintenance: number) => void;
    withTargets?: boolean;
};

const getItemSize = (_metricName: string, metricData: Metric) => {
    const { values } = metricData;
    if (!values) {
        return 45;
    }

    return 20 + Object.keys(values).length * 25;
};

export default function MobileMetricsList(props: Props): React.ReactElement {
    const { onSetMaintenance, onRemove, metrics, withTargets } = props;
    const entries = Object.entries(metrics);

    return (
        <div className={cn("root")}>
            <AutoSizer disableWidth>
                {({ height }: { height?: number }) => (
                    <List
                        height={height || 0}
                        width="100%"
                        itemSize={(index) => getItemSize(...entries[index])}
                        itemCount={entries.length}
                        itemData={entries}
                    >
                        {({ data, index, style }) => {
                            const [metricName, metricData] = data[index];

                            return (
                                <MobileMetricsListItem
                                    style={style}
                                    key={metricName}
                                    name={metricName}
                                    value={metricData}
                                    onRemove={() => onRemove(metricName)}
                                    onSetMaintenance={(interval) =>
                                        onSetMaintenance(metricName, interval)
                                    }
                                    withTargets={withTargets}
                                />
                            );
                        }}
                    </List>
                )}
            </AutoSizer>
        </div>
    );
}
