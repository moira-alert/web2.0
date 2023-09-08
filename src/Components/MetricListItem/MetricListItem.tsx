import cn from "../MetricList/MetricList.less";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
import { format, fromUnixTime, getUnixTime } from "date-fns";
import MetricValues from "../MetricValues/MetricValues";
import MaintenanceSelect from "../MaintenanceSelect/MaintenanceSelect";
import { Tooltip } from "@skbkontur/react-ui/components/Tooltip";
import UserIcon from "@skbkontur/react-icons/User";
import { Button } from "@skbkontur/react-ui/components/Button";
import TrashIcon from "@skbkontur/react-icons/Trash";
import * as React from "react";
import { getUTCDate, humanizeDuration } from "../../helpers/DateUtil";
import { Metric } from "../../Domain/Metric";

function maintenanceCaption(delta: number): React.ReactNode {
    return <span>{delta <= 0 ? "Maintenance" : humanizeDuration(delta)}</span>;
}

function maintenanceDelta(maintenance?: number | null): number {
    return (maintenance || 0) - getUnixTime(getUTCDate());
}

const hideTargetsNames = ({ values }: Metric) => !values || Object.keys(values).length === 1;

type MetricListItemProps = {
    status: boolean;
    metricName: string;
    metricData: Metric;
    style: React.CSSProperties;
    onChange: (metric: string, maintenance: number) => void;
    onRemove: (metric: string) => void;
};

export function MetricListItem({
    status,
    metricName,
    metricData,
    style,
    onChange,
    onRemove,
}: MetricListItemProps) {
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
                    hideTargetsNames={hideTargetsNames(metricData)}
                />
            </div>
            <div className={cn("maintenance")}>
                <MaintenanceSelect
                    maintenance={maintenance}
                    caption={maintenanceCaption(delta)}
                    onSetMaintenance={(maintenanceValue) => onChange(metricName, maintenanceValue)}
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
                                        fromUnixTime(maintenanceInfo.setup_time || 0),
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
                <Button use="link" icon={<TrashIcon />} onClick={() => onRemove(metricName)}>
                    Delete
                </Button>
            </div>
        </div>
    );
}
