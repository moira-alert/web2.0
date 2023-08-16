import * as React from "react";
import ArrowBoldDownIcon from "@skbkontur/react-icons/ArrowBoldDown";
import ArrowBoldUpIcon from "@skbkontur/react-icons/ArrowBoldUp";
import TrashIcon from "@skbkontur/react-icons/Trash";
import { Button } from "@skbkontur/react-ui/components/Button";
import { MetricItemList } from "../../Domain/Metric";
import cn from "./MetricList.less";
import { FixedSizeList as List } from "react-window";
import { MetricListItem } from "../MetricListItem/MetricListItem";

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

    const entries = Object.entries(items);

    return (
        <section className={cn("table")}>
            <header
                className={cn("row", "header")}
                // Если кол-во элементов в списке больше 25, они выходят за границу видимой области, и появляется скроллбар.
                // В этом случае добавляем пространство справа, чтобы заголовки не смещались относительно строк в списке.
                style={{ scrollbarGutter: entries.length > 25 ? "stable" : "auto" }}
            >
                {status && <div className={cn("state")} />}
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
                    {typeof noDataMetricCount === "number" &&
                        noDataMetricCount > 1 &&
                        onNoDataRemove && (
                            <Button
                                use="link"
                                icon={<TrashIcon />}
                                onClick={() => onNoDataRemove()}
                            >
                                Delete all NODATA
                            </Button>
                        )}
                </div>
            </header>
            <div className={cn("items")}>
                <List
                    height={500}
                    width="100%"
                    itemSize={20}
                    itemCount={entries.length}
                    itemData={entries}
                >
                    {({ data, index, style }) => (
                        <MetricListItem
                            status={status}
                            data={data}
                            index={index}
                            style={style}
                            onChange={onChange}
                            onRemove={onRemove}
                        />
                    )}
                </List>
            </div>
        </section>
    );
}
