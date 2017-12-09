// @flow
import * as React from "react";
import { Link as ReactRouterLink } from "react-router-dom";
import Icon from "retail-ui/components/Icon";

import type { Trigger } from "../../../Domain/Trigger.js";
import type { Status } from "../../../Domain/Status";
import type { Metric, MetricList } from "../../../Domain/Metric";
import type { Maintenance } from "../../../Domain/Maintenance";
import { getPageLink } from "../../../Domain/Global";
import { Statuses } from "../../../Domain/Status";
import getStatusColor from "../Styles/StatusColor";

import MobileStatusIndicator from "../MobileStatusIndicator/MobileStatusIndicator";

import cn from "./MobileTriggerListItem.less";

type Props = {|
    data: Trigger,
    onChange?: (maintenance: Maintenance, metric: string) => void,
    onRemove?: (metric: string) => void,
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
            showMetrics: false,
            groupedMetrics: this.groupMetricsByStatuses((props.data.last_check || {}).metrics),
        };
    }

    groupMetricsByStatuses(metrics: MetricList): { [status: Status]: { [metric: string]: Metric } } {
        const result = {};
        for (const metricName in metrics) {
            if (Object.hasOwnProperty.call(metrics, metricName)) {
                const metric = metrics[metricName];
                if (result[metric.state] == null) {
                    result[metric.state] = {};
                }
                result[metric.state][metricName] = metric;
            }
        }
        return result;
    }

    filterMetricsByStatus(status: Status): { [metric: string]: Metric } {
        return this.state.groupedMetrics[status] || {};
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
        const { state: triggerStatus } = this.props.data.last_check || {};
        const metricStatuses = Object.keys(Statuses).filter(
            x => Object.keys(this.filterMetricsByStatus(x)).length !== 0
        );
        const notOkStatuses = metricStatuses.filter(x => x !== Statuses.OK);
        let statuses;
        if (triggerStatus === Statuses.EXCEPTION) {
            statuses = [Statuses.EXCEPTION];
        } else if (metricStatuses.length === 0) {
            statuses = [triggerStatus];
        } else if (notOkStatuses.length === 0) {
            statuses = [Statuses.OK];
        } else {
            statuses = notOkStatuses;
        }
        return <MobileStatusIndicator size={40} statuses={statuses} />;
    }

    render(): React.Node {
        const { id, name, tags, throttling } = this.props.data;

        return (
            <ReactRouterLink className={cn("root")} to={getPageLink("trigger", id)}>
                <div className={cn("status")}>
                    {this.renderStatus()}
                    {throttling !== 0 && (
                        <div className={cn("throttling-flag")}>
                            <Icon name="FlagSolid" />
                        </div>
                    )}
                </div>
                <div className={cn("info")}>
                    <div className={cn("name")}>{name != null && name !== "" ? name : "[No name]"}</div>
                    <div className={cn("tags")}>{tags.map(x => "#" + x).join(", ")}</div>
                    <div className={cn("metrics")}>Metrics: {this.renderCounters()}</div>
                </div>
            </ReactRouterLink>
        );
    }
}
