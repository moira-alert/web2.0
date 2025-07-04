import * as React from "react";
import ArrowBoldDownIcon from "@skbkontur/react-icons/ArrowBoldDown";
import ArrowBoldUpIcon from "@skbkontur/react-icons/ArrowBoldUp";
import { Metric, MetricItemList } from "../../Domain/Metric";
import type { VariableSizeList } from "react-window";
import { VariableSizeList as List } from "react-window";
import { MetricListItem } from "../MetricListItem/MetricListItem";
import { useEffect, useRef } from "react";
import {
    METRIC_LIST_HEIGHT,
    METRIC_LIST_ROW_HEIGHT,
    METRIC_LIST_ROW_PADDING,
    MAX_METRIC_LIST_LENGTH_BEFORE_SCROLLABLE,
} from "../../Constants/heights";
import { ConfirmMetricDeletionWithTransformNull } from "../ConfirmMetricDeletionWithTransformNull/ConfirmMetricDeletionWithTransformNull";
import classNames from "classnames/bind";

import styles from "./MetricList.module.less";

const cn = classNames.bind(styles);

export type SortingColumn = "state" | "name" | "event" | "value";

type Props = {
    status?: boolean;
    items: MetricItemList;
    sortingColumn: SortingColumn;
    sortingDown?: boolean;
    noDataMetricCount?: number;
    onSort?: (sorting: SortingColumn) => void;
    onChange: (metric: string, maintenance: number) => void;
    onRemove: (metric: string) => void;
    onNoDataRemove?: () => void;
};

const getItemSize = (_metricName: string, metricData: Metric) => {
    const { values } = metricData;
    if (!values) {
        return METRIC_LIST_ROW_HEIGHT;
    }

    return Object.keys(values).length * METRIC_LIST_ROW_HEIGHT;
};

const getTotalSize = (entries: [string, Metric][]) =>
    entries.reduce(
        (totalSize, metric) => (totalSize += getItemSize(...metric)),
        METRIC_LIST_ROW_PADDING
    );

export default function MetricList(props: Props): React.ReactElement {
    const {
        status,
        items,
        onSort,
        onChange,
        onRemove,
        noDataMetricCount,
        onNoDataRemove,
        sortingColumn,
        sortingDown,
    } = props;

    const sortingIcon = sortingDown ? <ArrowBoldDownIcon /> : <ArrowBoldUpIcon />;
    const ref = useRef<VariableSizeList>(null);
    const entries = Object.entries(items);

    // When the sorting state is changed, call resetAfterIndex to recache row offsets and measurements
    useEffect(() => ref.current?.resetAfterIndex(0, true), [sortingColumn, sortingDown]);

    return (
        <section className={cn("table")}>
            <header
                className={cn("row", "header")}
                // When the metrics list is over MAX_METRIC_LIST_LENGTH_BEFORE_SCROLLABLE items, it becomes scrollable.
                // Add a scrollbar gutter on the right to align header cells with row cells.
                style={{
                    scrollbarGutter:
                        entries.length > MAX_METRIC_LIST_LENGTH_BEFORE_SCROLLABLE
                            ? "stable"
                            : "auto",
                }}
            >
                {status && (
                    <div className={cn("state")}>
                        <button
                            type="button"
                            className={cn("a11y-span", { sorting: onSort })}
                            onClick={onSort && (() => onSort("state"))}
                        >
                            State
                            {sortingColumn === "state" && (
                                <span className={cn("icon")}>{sortingIcon}</span>
                            )}
                        </button>
                    </div>
                )}

                <div className={cn("name")}>
                    <button
                        type="button"
                        className={cn("a11y-span", { sorting: onSort })}
                        onClick={onSort && (() => onSort("name"))}
                    >
                        Name
                        {sortingColumn === "name" && (
                            <span className={cn("icon")}>{sortingIcon}</span>
                        )}
                    </button>
                </div>
                <div className={cn("event")}>
                    <button
                        type="button"
                        className={cn("a11y-span", { sorting: onSort })}
                        onClick={onSort && (() => onSort("event"))}
                    >
                        Last event{" "}
                        {sortingColumn === "event" && (
                            <span className={cn("icon")}>{sortingIcon}</span>
                        )}
                    </button>
                </div>
                <div className={cn("value")}>
                    <button
                        type="button"
                        className={cn("a11y-span", { sorting: onSort })}
                        onClick={onSort && (() => onSort("value"))}
                    >
                        Value{" "}
                        {sortingColumn === "value" && (
                            <span className={cn("icon")}>{sortingIcon}</span>
                        )}
                    </button>
                </div>
                <div className={cn("maintenance")} />
                <div className={cn("author")} />
                <div className={cn("delete")}>
                    {(noDataMetricCount ?? 0) > 1 && onNoDataRemove && (
                        <ConfirmMetricDeletionWithTransformNull
                            deleteButtonText="Delete all NODATA"
                            action={onNoDataRemove}
                        />
                    )}
                </div>
            </header>
            <div className={cn("items")}>
                <List
                    ref={ref}
                    height={
                        // When the metrics list is over MAX_METRIC_LIST_LENGTH_BEFORE_SCROLLABLE items, it will have a fixed 500px height.
                        // Otherwise, the total height will be the sum of individual row heights.
                        entries.length > MAX_METRIC_LIST_LENGTH_BEFORE_SCROLLABLE
                            ? METRIC_LIST_HEIGHT
                            : getTotalSize(entries) + 2
                    }
                    width="100%"
                    itemSize={(index) => getItemSize(...entries[index])}
                    itemCount={entries.length}
                    itemData={entries}
                >
                    {({ data, index, style }) => {
                        const [metricName, metricData] = data[index];
                        return (
                            <MetricListItem
                                status={status ?? false}
                                metricName={metricName}
                                metricData={metricData}
                                style={style}
                                onChange={onChange}
                                onRemove={onRemove}
                            />
                        );
                    }}
                </List>
            </div>
        </section>
    );
}
