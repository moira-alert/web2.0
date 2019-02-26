// @flow
import * as React from "react";
import moment from "moment";
import { Link as ReactRouterLink } from "react-router-dom";
import FlagSolidIcon from "@skbkontur/react-icons/FlagSolid";
import UserSettingsIcon from "@skbkontur/react-icons/UserSettings";
import type { Trigger } from "../../../Domain/Trigger";
import type { Status } from "../../../Domain/Status";
import type { Metric, MetricList } from "../../../Domain/Metric";
import { getPageLink } from "../../../Domain/Global";
import { Statuses } from "../../../Domain/Status";
import getStatusColor from "../Styles/StatusColor";
import MobileStatusIndicator from "../MobileStatusIndicator/MobileStatusIndicator";

import groupMetricsByStatuses from "../../../helpers/group-metrics-by-statuses";

import cn from "./MobileTriggerListItem.less";

type Props = {|
    data: Trigger,
|};

type State = {
    groupedMetrics: { [status: Status]: { [metric: string]: Metric } },
};

export default class TriggerListItem extends React.Component<Props, State> {
    props: Props;

    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            groupedMetrics: TriggerListItem.groupMetricsByStatuses(
                (props.data.last_check || {}).metrics
            ),
        };
    }

    static groupMetricsByStatuses(
        metrics: MetricList
    ): { [status: Status]: { [metric: string]: Metric } } {
        return groupMetricsByStatuses(metrics);
    }

    render(): React.Node {
        const { data } = this.props;
        const { id, name, tags, throttling, last_check: lastCheck = {} } = data;
        const { maintenance = 0 } = lastCheck;
        const delta = maintenance - moment.utc().unix();

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
                    <div className={cn("tags")}>{tags.map(x => `#${x}`).join(", ")}</div>
                    <div className={cn("metrics")}>Metrics: {this.renderCounters()}</div>
                </div>
            </ReactRouterLink>
        );
    }

    renderCounters(): React.Node {
        const counters = Object.keys(Statuses)
            .map(status => ({
                status,
                count: Object.keys(this.filterMetricsByStatus(status)).length,
            }))
            .filter(({ count }) => count !== 0)
            .map(({ status, count }) => (
                <span key={status}>
                    <span className={cn("caption")}>{status}: </span>
                    <span style={{ color: getStatusColor(status) }} className={cn("value")}>
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

    renderStatus(): React.Node {
        const { data } = this.props;
        const { state: triggerStatus } = data.last_check || {};
        const metricStatuses = Object.keys(Statuses).filter(
            x => Object.keys(this.filterMetricsByStatus(x)).length !== 0
        );
        const notOkStatuses = metricStatuses.filter(x => x !== Statuses.OK);
        let statuses;
        if (triggerStatus && (triggerStatus !== Statuses.OK || metricStatuses.length === 0)) {
            statuses = [triggerStatus];
        } else if (notOkStatuses.length !== 0) {
            statuses = notOkStatuses;
        } else {
            statuses = [Statuses.OK];
        }
        return <MobileStatusIndicator size={40} statuses={statuses} />;
    }

    filterMetricsByStatus(status: Status): { [metric: string]: Metric } {
        const { groupedMetrics } = this.state;
        return groupedMetrics[status] || {};
    }
}
