// @flow
import React from 'react';
import type { ContextRouter } from 'react-router-dom';
import type { IMoiraApi } from '../Api/MoiraAPI';
import type { Trigger, TriggerState } from '../Domain/Trigger';
import type { Metric } from '../Domain/Metric';
import type { Event } from '../Domain/Event';
import { withMoiraApi } from '../Api/MoiraApiInjection';
import TriggerInfo from '../Components/TriggerInfo/TriggerInfo';
import MetricList from '../Components/MetricList/MetricList';
import Tabs, { Tab } from '../Components/Tabs/Tabs';
import EventList from '../Components/EventList/EventList';
import Layout, { LayoutPlate, LayoutContent } from '../Components/Layout/Layout';

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {|
    loading: boolean;
    error: boolean;
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
        error: true,
        trigger: null,
        triggerState: null,
        triggerEvents: null,
    };

    componentDidMount() {
        this.getData();
    }

    async getData(): Promise<void> {
        const { moiraApi, match } = this.props;
        const { id } = match.params;
        if (typeof id !== 'string') {
            return;
        }
        try {
            const trigger = await moiraApi.getTrigger(id);
            const triggerState = await moiraApi.getTriggerState(id);
            const triggerEvents = await moiraApi.getTriggerEvents(id);
            this.setState({ loading: false, trigger, triggerState, triggerEvents });
        }
        catch (error) {
            this.setState({ error: true });
        }
    }

    composeMetrics(): Array<{ name: string; data: Metric }> {
        const { metrics } = this.state.triggerState || {};
        return metrics ? Object.keys(metrics).map(x => ({ name: x, data: metrics[x] })) : []; // TODO
    }

    render(): React.Element<*> {
        const { loading, error, trigger, triggerEvents } = this.state;
        return (
            <Layout loading={loading} loadingError={error}>
                {trigger && (
                    <LayoutPlate>
                        <TriggerInfo data={trigger} />
                    </LayoutPlate>
                )}
                {this.composeMetrics().length !== 0 && (
                    <LayoutContent>
                        <Tabs value='state'>
                            <Tab id='state' label='Current state'>
                                <MetricList items={this.composeMetrics()} status />
                            </Tab>
                            <Tab id='events' label='Events history'>
                                <EventList items={triggerEvents ? triggerEvents.list : []} />
                            </Tab>
                        </Tabs>
                    </LayoutContent>
                )}
            </Layout>
        );
    }
}

export default withMoiraApi(TriggerContainer);
