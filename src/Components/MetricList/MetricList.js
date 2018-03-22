// @flow
import * as React from "react";
import moment from "moment";
import Icon from "retail-ui/components/Icon";
import type { Metric } from "../../Domain/Metric";
import type { Maintenance } from "../../Domain/Maintenance";
import { roundValue } from "../../helpers";
import { Maintenances, getMaintenanceCaption } from "../../Domain/Maintenance";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
import Dropdown from "retail-ui/components/Dropdown";
import MenuItem from "retail-ui/components/MenuItem";
import Button from "retail-ui/components/Button";
import cn from "./MetricList.less";

export type SortingColum = "state" | "name" | "event" | "value";
type Props = {|
    status?: boolean,
    items: {
        [metric: string]: Metric,
    },
    sortingColumn?: SortingColum,
    sortingDown?: boolean,
    onSort?: (sorting: SortingColum) => void,
    onChange: (maintenance: Maintenance, metric: string) => void,
    onRemove: (metric: string) => void,
|};

function checkMaintenance(maintenance: ?number): React.Node {
    const delta = (maintenance || 0) - moment.utc().unix();
    return <div className={cn("caption")}>{delta <= 0 ? "Maintenance" : moment.duration(delta * 1000).humanize()}</div>;
}

export default function MetricList(props: Props): React.Node {
    const { status, items, onSort, onChange, onRemove, sortingColumn, sortingDown } = props;
    const sortingIcon = sortingDown ? "ArrowBoldDown" : "ArrowBoldUp";

    return (
        <section className={cn("table")}>
            <header className={cn("row", "header")}>
                {status && <div className={cn("state")} />}
                <div className={cn("name")}>
                    <span className={cn({ sorting: onSort })} onClick={onSort && (() => onSort("name"))}>
                        Name
                        {sortingColumn === "name" && (
                            <span className={cn("icon")}>
                                <Icon name={sortingIcon} />
                            </span>
                        )}
                    </span>
                </div>
                <div className={cn("event")}>
                    <span className={cn({ sorting: onSort })} onClick={onSort && (() => onSort("event"))}>
                        Last event{" "}
                        {sortingColumn === "event" && (
                            <span className={cn("icon")}>
                                <Icon name={sortingIcon} />
                            </span>
                        )}
                    </span>
                </div>
                <div className={cn("value")}>
                    <span className={cn({ sorting: onSort })} onClick={onSort && (() => onSort("value"))}>
                        Value{" "}
                        {sortingColumn === "value" && (
                            <span className={cn("icon")}>
                                <Icon name={sortingIcon} />
                            </span>
                        )}
                    </span>
                </div>
                <div className={cn("controls")} />
            </header>
            <div className={cn("items")}>
                {Object.keys(items).map(metric => {
                    const { value, event_timestamp: eventTimestamp = 0, state, maintenance } = items[metric];
                    return (
                        <div key={metric} className={cn("row")}>
                            {status && (
                                <div className={cn("state")}>
                                    <StatusIndicator statuses={[state]} size={10} />
                                </div>
                            )}
                            <div className={cn("name")}>{metric}</div>
                            <div className={cn("event")}>{moment.unix(eventTimestamp).format("MMMM D, HH:mm:ss")}</div>
                            <div className={cn("value")}>{roundValue(value)}</div>
                            <div className={cn("controls")}>
                                <Dropdown caption={checkMaintenance(maintenance)} use="link">
                                    {Object.keys(Maintenances).map(key => (
                                        <MenuItem key={key} onClick={() => onChange(key, metric)}>
                                            {getMaintenanceCaption(key)}
                                        </MenuItem>
                                    ))}
                                </Dropdown>
                                <Button use="link" icon="Trash" onClick={() => onRemove(metric)}>
                                    Del
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
