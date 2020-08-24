import * as React from "react";
import { getUnixTime } from "date-fns";
import { Link as ReactRouterLink } from "react-router-dom";
import FlagSolidIcon from "@skbkontur/react-icons/FlagSolid";
import UserSettingsIcon from "@skbkontur/react-icons/UserSettings";
import { Trigger } from "../../../Domain/Trigger";
import { Status } from "../../../Domain/Status";
import { MetricList } from "../../../Domain/Metric";
import { getPageLink } from "../../../Domain/Global";
import { Statuses } from "../../../Domain/Status";
import getStatusColor from "../Styles/StatusColor";
import MobileStatusIndicator from "../MobileStatusIndicator/MobileStatusIndicator";
import { getUTCDate } from "../../../helpers/DateUtil";
import groupMetricsByStatuses, {
    IMetricByStatuses,
} from "../../../helpers/group-metrics-by-statuses";

import cn from "./MobileTriggerListItem.less";

type Props = {
    data: Trigger;
};

type State = {
    groupedMetrics: IMetricByStatuses;
};

export default class TriggerListItem extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        const metrics = (props.data.last_check || {}).metrics;
        this.state = {
            groupedMetrics: metrics ? TriggerListItem.groupMetricsByStatuses(metrics) : {},
        };
    }

    static groupMetricsByStatuses(metrics: MetricList): IMetricByStatuses {
        return groupMetricsByStatuses(metrics);
    }

    render(): React.ReactElement {
        const { data } = this.props;
        const { id, name, tags, throttling, last_check: lastCheck } = data;
        const maintenance = (lastCheck && lastCheck.maintenance) || 0;
        const delta = maintenance - getUnixTime(getUTCDate());

        return (
            <ReactRouterLink className={cn("root")} to={getPageLink("trigger", id)}>
                <div className={cn("status")}>
                    {this.renderStatus()}
                    {throttling !== 0 && (
                        <div className={cn("throttling-flag")}>
                            <FlagSolidIcon />
                        </div>
                    )}
                    {delta > 0 && (
                        <div className={cn("maintenance")}>
                            <UserSettingsIcon />
                        </div>
                    )}
                </div>
                <div className={cn("info")}>
                    <div className={cn("name")}>
                        {name != null && name !== "" ? name : "[No name]"}
                    </div>
                    <div className={cn("tags")}>{tags.map((x) => `#${x}`).join(", ")}</div>
                    <div className={cn("metrics")}>Metrics: {this.renderCounters()}</div>
                </div>
            </ReactRouterLink>
        );
    }

    renderCounters(): React.ReactElement {
        const counters = Object.keys(Statuses)
            .map((status) => ({
                status,
                count: Object.keys(this.filterMetricsByStatus(status as Status)).length,
            }))
            .filter(({ count }) => count !== 0)
            .map(({ status, count }) => (
                <span key={status}>
                    <span className={cn("caption")}>{status}: </span>
                    <span
                        style={{ color: getStatusColor(status as Status) }}
                        className={cn("value")}
                    >
                        {count}
                    </span>
                </span>
            ));
        return (
            <span className={cn("metrics-list")}>
                {counters.length !== 0 ? counters : <span className={cn("NA")}>N/A</span>}
            </span>
        );
    }

    renderStatus(): React.ReactNode {
        const { data } = this.props;
        const { state: triggerStatus } = data.last_check || {};
        const metricStatuses = Object.keys(Statuses).filter(
            (x) => Object.keys(this.filterMetricsByStatus(x as Status)).length !== 0
        );
        const notOkStatuses = metricStatuses.filter((x) => x !== Statuses.OK) as Array<Status>;
        let statuses: Array<Status>;
        if (triggerStatus && (triggerStatus !== Statuses.OK || metricStatuses.length === 0)) {
            statuses = [triggerStatus];
        } else if (notOkStatuses.length !== 0) {
            statuses = notOkStatuses;
        } else {
            statuses = [Statuses.OK as Status];
        }
        return <MobileStatusIndicator size={40} statuses={statuses} />;
    }

    filterMetricsByStatus(status: Status): IMetricByStatuses {
        const { groupedMetrics } = this.state;
        return groupedMetrics[status] || {};
    }
}
