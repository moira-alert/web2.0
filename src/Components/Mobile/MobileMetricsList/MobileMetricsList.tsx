import type { ReactElement } from "react";
import { Metric, MetricItemList } from "../../../Domain/Metric";
import MobileMetricsListItem from "../MobileMetricsListItem/MobileMetricsListItem";
import { List } from "react-window";
import type { RowComponentProps } from "react-window";
import { AutoSizer, type AutoSizerChildProps } from "react-virtualized-auto-sizer";
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

interface MobileMetricsRowProps {
    entries: [string, Metric][];
    onRemove: (metricName: string) => void;
    onSetMaintenance: (metricName: string, maintenance: number) => void;
    withTargets?: boolean;
}

const MobileMetricRow = ({
    index,
    style,
    entries,
    onRemove,
    onSetMaintenance,
    withTargets,
}: RowComponentProps<MobileMetricsRowProps>) => {
    const [metricName, metricData] = entries[index];
    return (
        <MobileMetricsListItem
            style={style}
            key={metricName}
            name={metricName}
            value={metricData}
            onRemove={() => onRemove(metricName)}
            onSetMaintenance={(interval) => onSetMaintenance(metricName, interval)}
            withTargets={withTargets}
        />
    );
};

export default function MobileMetricsList(props: Props): ReactElement {
    const { onSetMaintenance, onRemove, metrics, withTargets } = props;
    const entries = Object.entries(metrics);

    return (
        <div className={cn("root")}>
            <AutoSizer
                ChildComponent={({ height }: AutoSizerChildProps) => {
                    const listHeight = height == null ? 400 : Math.max(height, 400);
                    return (
                        <List
                            style={{ height: `${listHeight}px`, width: "100%" }}
                            rowComponent={MobileMetricRow}
                            rowCount={entries.length}
                            rowHeight={(index) => getItemSize(...entries[index])}
                            rowProps={{
                                entries,
                                onRemove,
                                onSetMaintenance,
                                withTargets,
                            }}
                        />
                    );
                }}
            />
        </div>
    );
}
