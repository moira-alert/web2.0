// @flow
import * as React from "react";
import moment from "moment";
import ArrowBoldDownIcon from "@skbkontur/react-icons/ArrowBoldDown";
import ArrowBoldUpIcon from "@skbkontur/react-icons/ArrowBoldUp";
import TrashIcon from "@skbkontur/react-icons/Trash";
import Dropdown from "retail-ui/components/Dropdown";
import Button from "retail-ui/components/Button";
import MenuItem from "retail-ui/components/MenuItem";
import type { Maintenance } from "../../Domain/Maintenance";
import type { Metric } from "../../Domain/Metric";
import roundValue from "../../helpers/roundValue";
import { Maintenances, getMaintenanceCaption } from "../../Domain/Maintenance";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
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
    onChange: (metric: string, maintenance: Maintenance) => void,
    onRemove: (metric: string) => void,
    onNoDataRemove?: () => void,
|};

function checkMaintenance(maintenance: ?number): React.Node {
    const delta = (maintenance || 0) - moment.utc().unix();
    return <span>{delta <= 0 ? "Maintenance" : moment.duration(delta * 1000).humanize()}</span>;
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
                <div className={cn("controls")}>
                    {typeof noDataMerticCount === "number" &&
                        noDataMerticCount > 1 &&
                        onNoDataRemove && (
                            <span className={cn("delete-all")}>
                                <Button
                                    use="link"
                                    icon={<TrashIcon />}
                                    onClick={() => onNoDataRemove()}
                                >
                                    Delete all NODATA
                                </Button>
                            </span>
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
                    } = items[metric];
                    return (
                        <div key={metric} className={cn("row")}>
                            {status && (
                                <div className={cn("state")}>
                                    <StatusIndicator statuses={[state]} size={10} />
                                </div>
                            )}
                            <div className={cn("name")}>{metric}</div>
                            <div className={cn("event")}>
                                {moment.unix(eventTimestamp).format("MMMM D, HH:mm:ss")}
                            </div>
                            <div className={cn("value")}>{roundValue(value)}</div>
                            <div className={cn("controls")}>
                                <Dropdown caption={checkMaintenance(maintenance)} use="link">
                                    {Object.keys(Maintenances).map(key => (
                                        <MenuItem key={key} onClick={() => onChange(metric, key)}>
                                            {getMaintenanceCaption(key)}
                                        </MenuItem>
                                    ))}
                                </Dropdown>
                                <span className={cn("delete-metric")}>
                                    <Button
                                        use="link"
                                        icon={<TrashIcon />}
                                        onClick={() => onRemove(metric)}
                                    >
                                        Delete
                                    </Button>
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
