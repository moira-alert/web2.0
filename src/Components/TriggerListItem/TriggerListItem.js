// @flow
import React from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import type { Trigger } from '../../Domain/Trigger.js';
import type { Status } from '../../Domain/Status';
import type { Metric } from '../../Domain/Metric';
import type { Maintenance } from '../../Domain/Maintenance';
import { Statuses, getStatusColor, getStatusCaption } from '../../Domain/Status';
import Icon from 'retail-ui/components/Icon';
import StatusIndicator from '../StatusIndicator/StatusIndicator';
import TagList from '../TagList/TagList';
import Tabs, { Tab } from '../Tabs/Tabs';
import MetricList from '../MetricList/MetricList';
import cn from './TriggerListItem.less';

type Props = {|
    data: Trigger;
    onChange?: (maintenance: Maintenance, metric: string) => void;
    onRemove?: (metric: string) => void;
|};
type State = {|
    showMetrics: boolean;
|};

export default class TriggerListItem extends React.Component {
    props: Props;
    state: State;

    constructor() {
        super();
        this.state = {
            showMetrics: false,
        };
    }

    filterMetricsByStatus(status: Status): { [metric: string]: Metric } {
        const { metrics } = this.props.data.last_check || {};
        return Object.keys(metrics)
            .filter(x => metrics[x].state === status)
            .reduce((data, key) => {
                return { ...data, [key]: metrics[key] };
            }, {});
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
                return { ...data, [key]: metrics[key] };
            }, {});
    }

    toggleMetrics() {
        const { showMetrics } = this.state;
        this.setState({ showMetrics: !showMetrics });
    }

    renderCounters(): React.Element<*> {
        const counters = Object.keys(Statuses)
            .map(status => ({
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
            <div className={cn('counters')}>
                {counters.length !== 0 ? counters : <span className={cn('NA')}>N/A</span>}
            </div>
        );
    }

    renderStatus(): React.Element<*> {
        const { state: triggerStatus } = this.props.data.last_check || {};
        const metricStatuses = Object.keys(Statuses).filter(
            x => Object.keys(this.filterMetricsByStatus(x)).length !== 0
        );
        const notOkStatuses = metricStatuses.filter(x => x !== Statuses.OK);
        let statuses;
        if (metricStatuses.length === 0) {
            statuses = [triggerStatus];
        }
        else if (notOkStatuses.length === 0) {
            statuses = [Statuses.OK];
        }
        else {
            statuses = notOkStatuses;
        }
        return (
            <div className={cn('indicator')}>
                <StatusIndicator statuses={statuses} />
            </div>
        );
    }

    renderMetrics(): ?React.Element<*> {
        const { onChange, onRemove } = this.props;
        if (!onChange || !onRemove) {
            return null;
        }
        const statuses = Object.keys(Statuses).filter(x => Object.keys(this.filterMetricsByStatus(x)).length !== 0);
        if (statuses.length === 0) {
            return null;
        }
        const metrics = statuses.map(x => (
            <Tab key={x} id={x} label={getStatusCaption(x)}>
                <MetricList
                    items={this.sortMetricsByValue(this.filterMetricsByStatus(x))}
                    sortingColumn='value'
                    sortingDown
                    onChange={(maintenance, metric) => onChange(maintenance, metric)}
                    onRemove={metric => onRemove(metric)}
                />
            </Tab>
        ));
        return (
            <div className={cn('metrics')}>
                <Tabs value={statuses[0]}>{metrics}</Tabs>
            </div>
        );
    }

    render(): React.Element<*> {
        const { id, name, targets, tags, throttling } = this.props.data;
        const { showMetrics } = this.state;
        const metrics = this.renderMetrics();

        return (
            <div className={cn('row', { active: showMetrics })}>
                <div className={cn('state', { active: metrics })} onClick={metrics && (() => this.toggleMetrics())}>
                    {this.renderStatus()}
                    {this.renderCounters()}
                </div>
                <div className={cn('data')}>
                    <div className={cn('header')}>
                        <Link className={cn('link')} to={'/trigger/' + id}>
                            <div className={cn('title')}>
                                <div className={cn('name')}>{name}</div>
                                {throttling !== 0 && (
                                    <div
                                        className={cn('flag')}
                                        title={'Throttling until ' + moment.unix(throttling).format('MMMM D, HH:mm:ss')}>
                                        <Icon name='FlagSolid' />
                                    </div>
                                )}
                            </div>
                            <div
                                className={cn({
                                    targets: true,
                                    dark: showMetrics,
                                })}>
                                {targets.map((target, i) => (
                                    <div key={i} className={cn('target')}>
                                        {target}
                                    </div>
                                ))}
                            </div>
                        </Link>
                    </div>
                    <div className={cn('tags')}>
                        <TagList tags={tags} />
                    </div>
                    {showMetrics && metrics}
                </div>
            </div>
        );
    }
}
