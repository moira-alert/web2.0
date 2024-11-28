import React, { CSSProperties, useState } from "react";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
import { format, fromUnixTime, getUnixTime } from "date-fns";
import MetricValues from "../MetricValues/MetricValues";
import MaintenanceSelect from "../MaintenanceSelect/MaintenanceSelect";
import { Tooltip } from "@skbkontur/react-ui/components/Tooltip";
import UserIcon from "@skbkontur/react-icons/User";
import { getUTCDate, humanizeDuration } from "../../helpers/DateUtil";
import { Metric } from "../../Domain/Metric";
import { useHistory } from "react-router";
import { ConfirmMetricDeletionWithTransformNull } from "../ConfirmMetricDeletionWithTransformNull/ConfirmMetricDeletionWithTransformNull";
import { useTheme } from "../../shared/themes";
import classNames from "classnames/bind";

import styles from "../MetricList/MetricList.less";

const cn = classNames.bind(styles);

function maintenanceCaption(delta: number): React.ReactNode {
    return <span>{delta <= 0 ? "Maintenance" : humanizeDuration(delta)}</span>;
}

function maintenanceDelta(maintenance?: number | null): number {
    return (maintenance || 0) - getUnixTime(getUTCDate());
}

const hideTargetsNames = (values: { [metric: string]: number } | undefined) => {
    return !values || Object.keys(values).length === 1;
};

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
    const [hover, setHover] = useState(false);

    const {
        values,
        event_timestamp: eventTimestamp = 0,
        state,
        maintenance,
        maintenance_info: maintenanceInfo,
    } = metricData;
    const delta = maintenanceDelta(maintenance);

    const history = useHistory();
    const theme = useTheme();

    const handleMetricClick = () => {
        const searchParams = new URLSearchParams();
        searchParams.set("action", "events");
        searchParams.set("metric", metricName);
        history.push({ search: searchParams.toString() });
    };

    const baseStyle: CSSProperties = {
        backgroundColor: hover ? theme.appBgColorSecondary : theme.appBgColorPrimary,
        ...style,
    };

    return (
        <div
            onClick={handleMetricClick}
            key={metricName}
            className={cn("row")}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            style={baseStyle}
        >
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
                    values={values}
                    placeholder
                    hideTargetsNames={hideTargetsNames(metricData.values)}
                />
            </div>
            <div onClick={(e) => e.stopPropagation()} className={cn("maintenance")}>
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
            <div onClick={(e) => e.stopPropagation()} className={cn("delete")}>
                <ConfirmMetricDeletionWithTransformNull
                    deleteButtonText="Delete"
                    action={() => onRemove(metricName)}
                />
            </div>
        </div>
    );
}
