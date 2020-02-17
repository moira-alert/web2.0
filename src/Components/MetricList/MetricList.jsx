// @flow
import * as React from "react";
import { format, fromUnixTime, formatDistance } from "date-fns";
import ArrowBoldDownIcon from "@skbkontur/react-icons/ArrowBoldDown";
import ArrowBoldUpIcon from "@skbkontur/react-icons/ArrowBoldUp";
import UserIcon from "@skbkontur/react-icons/User";
import TrashIcon from "@skbkontur/react-icons/Trash";
import Tooltip from "retail-ui/components/Tooltip";
import Dropdown from "retail-ui/components/Dropdown";
import MenuItem from "retail-ui/components/MenuItem";
import Button from "retail-ui/components/Button";
import type { Maintenance } from "../../Domain/Maintenance";
import type { Metric } from "../../Domain/Metric";
import roundValue from "../../helpers/roundValue";
import { Maintenances, getMaintenanceCaption } from "../../Domain/Maintenance";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
import cn from "./MetricList.less";
import { getCurrentUnixTime } from "../../helpers/DateUtil";

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
    onChange: (metric: string, maintenance: Maintenance) => void,
    onRemove: (metric: string) => void,
    onNoDataRemove?: () => void,
|};

function maintenanceCaption(delta: number): React.Node {
    return <span>{delta <= 0 ? "Maintenance" : formatDistance(0, delta * 1000)}</span>;
}

function maintenanceDelta(maintenance: ?number): React.Node {
    return (maintenance || 0) - getCurrentUnixTime();
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
                            <div className={cn("value")}>{roundValue(value)}</div>
                            <div className={cn("maintenance")}>
                                <Dropdown use="link" caption={maintenanceCaption(delta)}>
                                    {Object.keys(Maintenances).map(key => (
                                        <MenuItem key={key} onClick={() => onChange(metric, key)}>
                                            {getMaintenanceCaption(key)}
                                        </MenuItem>
                                    ))}
                                </Dropdown>
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
                                                        fromUnixTime(maintenanceInfo.setup_time),
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
