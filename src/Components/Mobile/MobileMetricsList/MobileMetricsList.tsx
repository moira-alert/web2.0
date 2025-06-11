import * as React from "react";
import { Metric, MetricItemList } from "../../../Domain/Metric";
import MobileMetricsListItem from "../MobileMetricsListItem/MobileMetricsListItem";
import { VariableSizeList as List } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import classNames from "classnames/bind";

import styles from "./MobileMetricsList.module.less";

const cn = classNames.bind(styles);

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
                {({ height }) => {
                    return (
                        <List
                            height={height < 400 ? 400 : height}
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
                    );
                }}
            </AutoSizer>
        </div>
    );
}
