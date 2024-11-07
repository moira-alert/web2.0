import React, { FC, useCallback, useMemo, useState } from "react";
import MetricList, { SortingColumn } from "../../MetricList/MetricList";
import { sortMetrics } from "../../../helpers/sort-metrics";
import { MetricItemList } from "../../../Domain/Metric";
import { Status } from "../../../Domain/Status";
import { SearchInput } from "./SearchInput/SearchInput";
import { Flexbox } from "../../Flexbox/FlexBox";
import { EmptyListText } from "./EmptyListMessage/EmptyListText";
import { MAX_METRIC_LIST_LENGTH_BEFORE_SCROLLABLE } from "../../../helpers/constants";

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
    const [searchValue, setSearchValue] = useState<string>("");

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

    const handleInputValueChange = (value: string) => {
        setSearchValue(value);
    };

    const sortedMetrics = useMemo(() => sortMetrics(metrics, sortingColumn, sortingDown), [
        metrics,
        sortingColumn,
        sortingDown,
    ]);

    const filteredMetrics = useMemo(() => {
        if (!searchValue.trim()) {
            return sortedMetrics;
        }

        const lowercasedSearchValue = searchValue.toLowerCase().trim();

        const result: MetricItemList = {};

        for (const metricName in sortedMetrics) {
            if (metricName.toLowerCase().includes(lowercasedSearchValue)) {
                result[metricName] = sortedMetrics[metricName];
            }
        }
        return result;
    }, [sortedMetrics, searchValue]);

    const isFilteredMetrics = useMemo(
        () => filteredMetrics && Object.keys(filteredMetrics).length > 0,
        [filteredMetrics]
    );

    const isMetrics = useMemo(
        () => Object.keys(metrics).length > MAX_METRIC_LIST_LENGTH_BEFORE_SCROLLABLE,
        [metrics]
    );

    return (
        <Flexbox margin="28px 0 0 0" gap={28}>
            {isMetrics && (
                <SearchInput
                    value={searchValue}
                    width={"100%"}
                    placeholder="Filter by metric name"
                    onValueChange={handleInputValueChange}
                    onClear={() => setSearchValue("")}
                />
            )}
            {isFilteredMetrics ? (
                <MetricList
                    status
                    items={filteredMetrics}
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
                <EmptyListText text={"There is no metrics evaluated for this trigger."} />
            )}
        </Flexbox>
    );
};
