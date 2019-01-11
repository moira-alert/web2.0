// @flow
import * as React from "react";
import moment from "moment";
import { Link as ReactRouterLink } from "react-router-dom";
import { getPageLink } from "../../Domain/Global";
import type { Trigger } from "../../Domain/Trigger.js";
import type { Status } from "../../Domain/Status";
import type { Metric, MetricList } from "../../Domain/Metric";
import type { Maintenance } from "../../Domain/Maintenance";
import { Statuses, StatusesInOrder, getStatusColor, getStatusCaption } from "../../Domain/Status";
import ErrorIcon from "@skbkontur/react-icons/Error";
import FlagSolidIcon from "@skbkontur/react-icons/FlagSolid";
import RouterLink from "../RouterLink/RouterLink";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
import TagGroup from "../TagGroup/TagGroup";
import Tabs, { Tab } from "../Tabs/Tabs";
import MetricListView from "../MetricList/MetricList";
import cn from "./TriggerListItem.less";

type Props = {|
    data: Trigger,
    supportEmail: ?string,
    onChange?: (maintenance: Maintenance, metric: string) => void,
    onRemove?: (metric: string) => void,
|};

type State = {
    showMetrics: boolean,
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

    componentWillReceiveProps(nextProps: Props) {
        if (this.props.data !== nextProps.data) {
            this.setState({
                groupedMetrics: this.groupMetricsByStatuses((nextProps.data.last_check || {}).metrics),
            });
        }
    }

    filterMetricsByStatus(status: Status): { [metric: string]: Metric } {
        return this.state.groupedMetrics[status] || {};
    }

    sortMetricsByValue(metrics: { [metric: string]: Metric }): { [metric: string]: Metric } {
        return Object.keys(metrics)
            .sort((x, y) => {
                const valueA = metrics[x].value || 0;
                const valueB = metrics[y].value || 0;
                if (valueA < valueB) {
                    return -1;
                }
                if (valueA > valueB) {
                    return 1;
                }
                return 0;
            })
            .reduce((data, key) => {
                data[key] = metrics[key];
                return data;
            }, {});
    }

    toggleMetrics() {
        const { showMetrics } = this.state;
        this.setState({ showMetrics: !showMetrics });
    }

    renderCounters(): React.Node {
        const counters = StatusesInOrder.map(status => ({
            status,
            count: Object.keys(this.filterMetricsByStatus(status)).length,
        }))
            .filter(({ count }) => count !== 0)
            .map(({ status, count }) => (
                <span key={status} style={{ color: getStatusColor(status) }}>
                    {count}
                </span>
            ));
        return (
            <div className={cn("counters")}>
                {counters.length !== 0 ? counters : <span className={cn("NA")}>N/A</span>}
            </div>
        );
    }

    getHasExceptionState(): boolean {
        const { state: triggerStatus } = this.props.data.last_check || {};
        if (triggerStatus === Statuses.EXCEPTION) {
            return true;
        }
        return false;
    }

    renderStatus(): React.Node {
        const { state: triggerStatus } = this.props.data.last_check || {};
        const metricStatuses = StatusesInOrder.filter(x => Object.keys(this.filterMetricsByStatus(x)).length !== 0);
        const notOkStatuses = metricStatuses.filter(x => x !== Statuses.OK);
        let statuses;
        if (triggerStatus && (triggerStatus !== Statuses.OK || metricStatuses.length === 0)) {
            statuses = [triggerStatus];
        } else if (notOkStatuses.length !== 0) {
            statuses = notOkStatuses;
        } else {
            statuses = [Statuses.OK];
        }
        return (
            <div className={cn("indicator")}>
                <StatusIndicator statuses={statuses} />
            </div>
        );
    }

    renderExceptionHelpMessage(): React.Node {
        const { data } = this.props;
        const hasExpression = data.expression != null && data.expression !== "";
        const hasMultipleTargets = data.targets.length > 1;
        return (
            <div className={cn("exception-message")}>
                <ErrorIcon color={"#D43517"} /> Trigger in EXCEPTION state. Please{" "}
                <RouterLink to={`/trigger/${data.id}/edit`}>verify</RouterLink> trigger target
                {hasMultipleTargets ? "s" : ""}
                {hasExpression ? " and expression" : ""} on{" "}
                <RouterLink to={`/trigger/${data.id}/edit`}>trigger edit page</RouterLink>.{" "}
                <RouterLink to={`/trigger/${data.id}`}>See more details</RouterLink> on trigger page.
            </div>
        );
    }

    renderMetrics(): ?React.Node {
        const { onChange, onRemove } = this.props;
        if (!onChange || !onRemove) {
            return null;
        }
        const statuses = StatusesInOrder.filter(x => Object.keys(this.filterMetricsByStatus(x)).length !== 0);
        if (statuses.length === 0) {
            return null;
        }
        const metrics = statuses.map(x => (
            <Tab key={x} id={x} label={getStatusCaption(x)}>
                <MetricListView
                    items={this.sortMetricsByValue(this.filterMetricsByStatus(x))}
                    sortingColumn="value"
                    sortingDown
                    onChange={(maintenance, metric) => onChange(maintenance, metric)}
                    onRemove={metric => onRemove(metric)}
                />
            </Tab>
        ));
        return (
            <div className={cn("metrics")}>
                {this.getHasExceptionState() && this.renderExceptionHelpMessage()}
                <Tabs value={statuses[0]}>{metrics}</Tabs>
            </div>
        );
    }

    render(): React.Node {
        const { id, name, targets, tags, throttling } = this.props.data;
        const { showMetrics } = this.state;
        const metrics = this.renderMetrics();

        return (
            <div className={cn("row", { active: showMetrics })}>
                <div className={cn("state", { active: metrics })} onClick={metrics && (() => this.toggleMetrics())}>
                    {this.renderStatus()}
                    {this.renderCounters()}
                </div>
                <div className={cn("data")}>
                    <div className={cn("header")}>
                        <ReactRouterLink className={cn("link")} to={getPageLink("trigger", id)}>
                            <div className={cn("title")}>
                                <div className={cn("name")}>{name != null && name !== "" ? name : "[No name]"}</div>
                                {throttling !== 0 && (
                                    <div
                                        className={cn("flag")}
                                        title={
                                            "Throttling until " + moment.unix(throttling).format("MMMM D, HH:mm:ss")
                                        }>
                                        <FlagSolidIcon />
                                    </div>
                                )}
                            </div>
                            <div
                                className={cn({
                                    targets: true,
                                    dark: showMetrics,
                                })}>
                                {targets.map((target, i) => (
                                    <div key={i} className={cn("target")}>
                                        {target}
                                    </div>
                                ))}
                            </div>
                        </ReactRouterLink>
                    </div>
                    <div className={cn("tags")}>
                        <TagGroup tags={tags} />
                    </div>
                    {showMetrics && metrics}
                </div>
            </div>
        );
    }
}
