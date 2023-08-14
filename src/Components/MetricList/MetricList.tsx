import * as React from "react";
import { format, fromUnixTime, getUnixTime } from "date-fns";
import ArrowBoldDownIcon from "@skbkontur/react-icons/ArrowBoldDown";
import ArrowBoldUpIcon from "@skbkontur/react-icons/ArrowBoldUp";
import UserIcon from "@skbkontur/react-icons/User";
import TrashIcon from "@skbkontur/react-icons/Trash";
import { Tooltip } from "@skbkontur/react-ui/components/Tooltip";
import { Button } from "@skbkontur/react-ui/components/Button";
import { MetricItemList } from "../../Domain/Metric";
import { getUTCDate, humanizeDuration } from "../../helpers/DateUtil";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
import MetricValues from "../MetricValues/MetricValues";
import MaintenanceSelect from "../MaintenanceSelect/MaintenanceSelect";
import cn from "./MetricList.less";
import { FixedSizeList as List } from "react-window";

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

function maintenanceCaption(delta: number): React.ReactNode {
    return <span>{delta <= 0 ? "Maintenance" : humanizeDuration(delta)}</span>;
}

function maintenanceDelta(maintenance?: number | null): number {
    return (maintenance || 0) - getUnixTime(getUTCDate());
}

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
    const hideTargetsNames = Object.keys(items).every((metric) => {
        const { values } = items[metric];
        return !values || Object.keys(values).length === 1;
    });
    const entries = Object.entries(items);

    return (
        <section className={cn("table")}>
            <header className={cn("row", "header")}>
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
                {/*Добавляем пустой блок, чтобы подвинуть заголовки влево, когда у списка есть скроллбар. */}
                {/*Скроллбар появляется, как только общая высота строк становится больше высоты списка.*/}
                {/*Поэтому кол-во строк, при котором нужно подвинуть заголовок, это 500 (высота списка) / 20 (высота строки) = 25*/}
                {/*Обсуждение на гитхабе: https://github.com/moira-alert/web2.0/pull/415#discussion_r1293250011*/}
                <div style={{ width: entries.length > 25 ? "50px" : 0 }}></div>
            </header>
            <div className={cn("items")}>
                <List
                    height={500}
                    width="100%"
                    itemSize={20}
                    itemCount={entries.length}
                    itemData={entries}
                >
                    {({ data, index, style }) => {
                        const [metricName, metricData] = data[index];
                        const {
                            value,
                            values,
                            event_timestamp: eventTimestamp = 0,
                            state,
                            maintenance,
                            maintenance_info: maintenanceInfo,
                        } = metricData;
                        const delta = maintenanceDelta(maintenance);
                        return (
                            <div key={metricName} className={cn("row")} style={style}>
                                {status && (
                                    <div className={cn("state")}>
                                        <StatusIndicator statuses={[state]} size={10} />
                                    </div>
                                )}
                                <div className={cn("name")}>{metricName}</div>
                                <div className={cn("event")}>
                                    {format(fromUnixTime(eventTimestamp), "MMM d, y, HH:mm:ss")}
                                </div>
                                <div className={cn("value")}>
                                    <MetricValues
                                        value={value}
                                        values={values}
                                        placeholder
                                        hideTargetsNames={hideTargetsNames}
                                    />
                                </div>
                                <div className={cn("maintenance")}>
                                    <MaintenanceSelect
                                        maintenance={maintenance}
                                        caption={maintenanceCaption(delta)}
                                        onSetMaintenance={(maintenanceValue) =>
                                            onChange(metricName, maintenanceValue)
                                        }
                                    />
                                </div>
                                <div className={cn("author")}>
                                    {delta > 0 &&
                                        maintenanceInfo &&
                                        maintenanceInfo.setup_user &&
                                        maintenanceInfo.setup_time && (
                                            <Tooltip
                                                render={() => (
                                                    <div>
                                                        Maintenance was set
                                                        <br />
                                                        by {maintenanceInfo.setup_user}
                                                        <br />
                                                        at{" "}
                                                        {format(
                                                            fromUnixTime(
                                                                maintenanceInfo.setup_time || 0
                                                            ),
                                                            "MMMM d, HH:mm:ss"
                                                        )}
                                                    </div>
                                                )}
                                            >
                                                <UserIcon className={cn("maintenance-info")} />
                                            </Tooltip>
                                        )}
                                </div>
                                <div className={cn("delete")}>
                                    <Button
                                        use="link"
                                        icon={<TrashIcon />}
                                        onClick={() => onRemove(metricName)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        );
                    }}
                </List>
            </div>
        </section>
    );
}
