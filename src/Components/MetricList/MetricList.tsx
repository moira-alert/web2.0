import type { ReactElement } from "react";
import { IconUiFilterSortALowToHighRegular16 } from "@skbkontur/icons/IconUiFilterSortALowToHighRegular16";
import { IconUiFilterSortAHighToLowRegular16 } from "@skbkontur/icons/IconUiFilterSortAHighToLowRegular16";
import { Metric, MetricItemList } from "../../Domain/Metric";
import { List } from "react-window";
import type { RowComponentProps } from "react-window";
import { MetricListItem } from "../MetricListItem/MetricListItem";
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

interface MetricRowProps {
    entries: [string, Metric][];
    status: boolean;
    onChange: (metric: string, maintenance: number) => void;
    onRemove: (metric: string) => void;
}

const MetricRow = ({
    index,
    style,
    entries,
    status,
    onChange,
    onRemove,
}: RowComponentProps<MetricRowProps>) => {
    const [metricName, metricData] = entries[index];
    return (
        <MetricListItem
            status={status}
            metricName={metricName}
            metricData={metricData}
            style={style}
            onChange={onChange}
            onRemove={onRemove}
        />
    );
};

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

export default function MetricList(props: Props): ReactElement {
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

    const sortingIcon = sortingDown ? (
        <IconUiFilterSortALowToHighRegular16 />
    ) : (
        <IconUiFilterSortAHighToLowRegular16 />
    );

    const entries = Object.entries(items);

    const totalListHeightBeforeScroll = getTotalSize(entries) + 2;

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
                            State{" "}
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
                        Name{" "}
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
                    style={{
                        height:
                            // When the metrics list is over MAX_METRIC_LIST_LENGTH_BEFORE_SCROLLABLE items, it will have a fixed 500px height.
                            // Otherwise, the total height will be the sum of individual row heights.
                            entries.length > MAX_METRIC_LIST_LENGTH_BEFORE_SCROLLABLE
                                ? METRIC_LIST_HEIGHT
                                : totalListHeightBeforeScroll,
                        width: "100%",
                    }}
                    rowComponent={MetricRow}
                    rowCount={entries.length}
                    rowHeight={(index) => getItemSize(...entries[index])}
                    rowProps={{
                        entries,
                        status: status ?? false,
                        onChange,
                        onRemove,
                    }}
                />
            </div>
        </section>
    );
}
