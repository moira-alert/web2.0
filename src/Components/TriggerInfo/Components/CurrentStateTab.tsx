import React, { FC, useCallback, useMemo, useState } from "react";
import MetricList, { SortingColumn } from "../../MetricList/MetricList";
import { sortMetrics } from "../../../helpers/sort-metrics";
import { MetricItemList } from "../../../Domain/Metric";
import { Status } from "../../../Domain/Status";
import { Center } from "@skbkontur/react-ui/components/Center";

interface ICurrentStateTabProps {
    metrics: MetricItemList;
    setMetricMaintenance: (metric: string, maintenance: number) => void;
    removeMetric: (metric: string) => void;
    removeNoDataMetric: () => void;
}

export const CurrentStateTab: FC<ICurrentStateTabProps> = ({
    metrics,
    setMetricMaintenance,
    removeMetric,
    removeNoDataMetric,
}) => {
    const [sortingColumn, setSortingColumn] = useState<SortingColumn>("event");
    const [sortingDown, setSortingDown] = useState(false);

    const isMetrics = useMemo(() => metrics && Object.keys(metrics).length > 0, [metrics]);

    const noDataMetricCount = useMemo(
        () => Object.keys(metrics).filter((key) => metrics[key].state === Status.NODATA).length,
        [metrics]
    );

    const handleSort = useCallback(
        (sorting: SortingColumn) => {
            if (sorting === sortingColumn) {
                setSortingDown(!sortingDown);
            } else {
                setSortingColumn(sorting);
                setSortingDown(true);
            }
        },
        [sortingColumn, sortingDown]
    );

    return isMetrics ? (
        <MetricList
            status
            items={sortMetrics(metrics, sortingColumn, sortingDown)}
            onSort={handleSort}
            sortingColumn={sortingColumn}
            sortingDown={sortingDown}
            onChange={(metric, maintenance) => {
                setMetricMaintenance(metric, maintenance);
            }}
            onRemove={(metric) => removeMetric(metric)}
            noDataMetricCount={noDataMetricCount}
            onNoDataRemove={removeNoDataMetric}
        />
    ) : (
        <Center>
            <span style={{ color: "#888888" }}>
                There is no metrics evaluated for this trigger.
            </span>
        </Center>
    );
};
