import React, { useRef, useState } from "react";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
import { format, fromUnixTime } from "date-fns";
import MetricValues from "../MetricValues/MetricValues";
import MaintenanceSelect from "../MaintenanceSelect/MaintenanceSelect";
import { Tooltip } from "@skbkontur/react-ui/components/Tooltip";
import UserIcon from "@skbkontur/react-icons/User";
import { humanizeDuration } from "../../helpers/DateUtil";
import { Metric } from "../../Domain/Metric";
import { useNavigate } from "react-router-dom";
import { ConfirmMetricDeletionWithTransformNull } from "../ConfirmMetricDeletionWithTransformNull/ConfirmMetricDeletionWithTransformNull";
import { maintenanceDelta } from "../../Domain/Trigger";
import classNames from "classnames/bind";

import styles from "../MetricList/MetricList.module.less";

const cn = classNames.bind(styles);

function maintenanceCaption(delta: number): React.ReactNode {
    return <span>{delta <= 0 ? "Maintenance" : humanizeDuration(delta)}</span>;
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
    const {
        values,
        event_timestamp: eventTimestamp = 0,
        state,
        maintenance,
        maintenance_info: maintenanceInfo,
    } = metricData;
    const delta = maintenanceDelta(maintenance);
    const ref = useRef<HTMLDivElement>(null);
    const [truncated, setTruncated] = useState(false);

    const navigate = useNavigate();

    const handleMetricClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const searchParams = new URLSearchParams();
        const selection = window.getSelection();
        const selectedText = selection?.toString() || "";

        if (selectedText.length > 0) {
            event.preventDefault();
            return;
        }

        searchParams.set("action", "events");
        searchParams.set("metric", metricName);
        navigate({ search: searchParams.toString() });
    };

    const handleMouseEnter = () => {
        const el = ref.current;
        if (el) {
            setTruncated(el.scrollWidth > el.clientWidth);
        }
    };

    return (
        <div onClick={handleMetricClick} key={metricName} className={cn("row")} style={style}>
            {status && (
                <div className={cn("state")}>
                    <StatusIndicator statuses={[state]} size={10} />
                </div>
            )}
            <div onMouseEnter={handleMouseEnter} ref={ref} className={cn("name")}>
                <Tooltip render={() => (truncated ? metricName : null)}>{metricName}</Tooltip>
            </div>
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
