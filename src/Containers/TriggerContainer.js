// @flow
import React from 'react';
import moment from 'moment';
import type { ContextRouter } from 'react-router-dom';
import type { IMoiraApi } from '../Api/MoiraAPI';
import type { Trigger, TriggerState } from '../Domain/Trigger';
import type { Metric } from '../Domain/Metric';
import type { Maintenance } from '../Domain/Maintenance';
import type { Event } from '../Domain/Event';
import { withMoiraApi } from '../Api/MoiraApiInjection';
import { getMaintenanceTime } from '../Domain/Maintenance';
import TriggerInfo from '../Components/TriggerInfo/TriggerInfo';
import MetricList from '../Components/MetricList/MetricList';
import Tabs, { Tab } from '../Components/Tabs/Tabs';
import EventList from '../Components/EventList/EventList';
import Layout, { LayoutPlate, LayoutContent } from '../Components/Layout/Layout';

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {|
    loading: boolean;
    error: ?string;
    trigger: ?Trigger;
    triggerState: ?TriggerState;
    triggerEvents: ?{|
        total: number;
        list: Array<Event>;
        page: number;
        size: number;
    |};
|};

class TriggerContainer extends React.Component {
    props: Props;
    state: State = {
        loading: true,
        error: null,
        trigger: null,
        triggerState: null,
        triggerEvents: null,
    };

    componentDidMount() {
        this.getData(this.props);
    }

    async getData(props: Props): Promise<void> {
        const { moiraApi, match } = props;
        const { id } = match.params;
        if (typeof id !== 'string') {
            return;
        }
        try {
            const trigger = await moiraApi.getTrigger(id);
            const triggerState = await moiraApi.getTriggerState(id);
            const triggerEvents = await moiraApi.getTriggerEvents(id);
            this.setState({
                loading: false,
                trigger,
                triggerState,
                triggerEvents,
            });
        }
        catch (error) {
            this.setState({ error: 'Network error. Please, reload page' });
        }
    }

    async disableTrhrottling(triggerId: string): Promise<void> {
        this.setState({ loading: true });
        await this.props.moiraApi.delThrottling(triggerId);
        this.getData(this.props);
    }

    async setMaintenance(triggerId: string, maintenance: Maintenance, metric: string): Promise<void> {
        this.setState({ loading: true });
        const maintenanceTime = getMaintenanceTime(maintenance);
        await this.props.moiraApi.setMaintenance(triggerId, {
            [metric]:
                maintenanceTime > 0
                    ? moment
                          .utc()
                          .add(maintenanceTime, 'minutes')
                          .unix()
                    : maintenanceTime,
        });
        this.getData(this.props);
    }

    async removeMetric(triggerId: string, metric: string): Promise<void> {
        this.setState({ loading: true });
        await this.props.moiraApi.delMetric(triggerId, metric);
        this.getData(this.props);
    }

    render(): React.Element<*> {
        const { loading, error, trigger, triggerState, triggerEvents } = this.state;
        const { metrics } = triggerState || {};
        const { list: events } = triggerEvents || {};
        const isMetrics = metrics && Object.keys(metrics).length > 0;
        const isEvents = events && events.length > 0;
        return (
            <Layout loading={loading} error={error}>
                {trigger && (
                    <LayoutPlate>
                        <TriggerInfo
                            data={trigger}
                            onThrottlingRemove={triggerId => {
                                this.disableTrhrottling(triggerId);
                            }}
                        />
                    </LayoutPlate>
                )}
                {(isMetrics || isEvents) && (
                    <LayoutContent>
                        <Tabs value={isMetrics ? 'state' : 'events'}>
                            {isMetrics &&
                            trigger && (
                                <Tab id='state' label='Current state'>
                                    <MetricList
                                        items={metrics}
                                        onChange={(maintenance, metric) => {
                                            this.setMaintenance(trigger.id, maintenance, metric);
                                        }}
                                        onRemove={metric => {
                                            this.removeMetric(trigger.id, metric);
                                        }}
                                    />
                                </Tab>
                            )}
                            {isEvents && (
                                <Tab id='events' label='Events history'>
                                    <EventList items={events} />
                                </Tab>
                            )}
                        </Tabs>
                    </LayoutContent>
                )}
            </Layout>
        );
    }
}

export default withMoiraApi(TriggerContainer);
