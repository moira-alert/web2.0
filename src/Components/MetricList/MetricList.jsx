// @flow
import * as React from "react";
import { format, fromUnixTime, getUnixTime } from "date-fns";
import ArrowBoldDownIcon from "@skbkontur/react-icons/ArrowBoldDown";
import ArrowBoldUpIcon from "@skbkontur/react-icons/ArrowBoldUp";
import UserIcon from "@skbkontur/react-icons/User";
import TrashIcon from "@skbkontur/react-icons/Trash";
import { Tooltip } from "@skbkontur/react-ui/components/Tooltip";
import { Button } from "@skbkontur/react-ui/components/Button";
import type { Metric } from "../../Domain/Metric";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
import MetricValues from "../MetricValues/MetricValues";
import { getUTCDate, humanizeDuration } from "../../helpers/DateUtil";
import MaintenanceSelect from "../MaintenanceSelect/MaintenanceSelect";
import cn from "./MetricList.less";

export type SortingColum = "state" | "name" | "event" | "value";

type Props = {|
    status?: boolean,
    items: {
        [metric: string]: Metric,
    },
    sortingColumn: SortingColum,
    sortingDown?: boolean,
    noDataMerticCount?: number,
    onSort?: (sorting: SortingColum) => void,
    onChange: (metric: string, maintenance: number) => void,
    onRemove: (metric: string) => void,
    onNoDataRemove?: () => void,
|};

function maintenanceCaption(delta: number): React.Node {
    return <span>{delta <= 0 ? "Maintenance" : humanizeDuration(delta)}</span>;
}

function maintenanceDelta(maintenance: ?number): number {
    return (maintenance || 0) - getUnixTime(getUTCDate());
}

export default function MetricList(props: Props): React.Node {
    const {
        status,
        items,
        onSort,
        onChange,
        onRemove,
        noDataMerticCount,
        onNoDataRemove,
        sortingColumn,
        sortingDown,
    } = props;

    const sortingIcon = sortingDown ? <ArrowBoldDownIcon /> : <ArrowBoldUpIcon />;
    const hideTargetsNames = Object.keys(items).every(metric => {
        const { values } = items[metric];
        return !values || Object.keys(values).length === 1;
    });

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
                    {typeof noDataMerticCount === "number" &&
                        noDataMerticCount > 1 &&
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
                {Object.keys(items).map(metric => {
                    const {
                        value,
                        values,
                        event_timestamp: eventTimestamp = 0,
                        state,
                        maintenance,
                        maintenance_info: maintenanceInfo,
                    } = items[metric];
                    const delta = maintenanceDelta(maintenance);
                    return (
                        <div key={metric} className={cn("row")}>
                            {status && (
                                <div className={cn("state")}>
                                    <StatusIndicator statuses={[state]} size={10} />
                                </div>
                            )}
                            <div className={cn("name")}>{metric}</div>
                            <div className={cn("event")}>
                                {format(fromUnixTime(eventTimestamp), "MMMM d, HH:mm:ss")}
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
                                    onSetMaintenance={maintenanceValue =>
                                        onChange(metric, maintenanceValue)
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
                                    onClick={() => onRemove(metric)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
