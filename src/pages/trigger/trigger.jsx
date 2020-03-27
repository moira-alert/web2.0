// @flow
import * as React from "react";
import type { ContextRouter } from "react-router-dom";
import isEqual from "lodash/isEqual";
import type { Trigger, TriggerState } from "../../Domain/Trigger";
import type { Event } from "../../Domain/Event";
import type { IMoiraApi } from "../../Api/MoiraApi";
import type { Maintenance } from "../../Domain/Maintenance";
import { withMoiraApi } from "../../Api/MoiraApiInjection";
import { setMetricMaintenance, setTriggerMaintenance } from "../../Domain/Maintenance";

type Props = ContextRouter & { moiraApi: IMoiraApi };

type State = {
    loading: boolean,
    error: ?string,
    trigger: ?Trigger,
    triggerState: ?TriggerState,
    triggerEvents: Array<Event>,
};

// ToDo решить, нужно ли подтягивать данные с сервера, если что-то изменилось

class TriggerPage extends React.Component<Props, State> {
    state: State = {
        loading: true,
        error: null,
        trigger: null,
        triggerState: null,
        triggerEvents: [],
    };

    componentDidMount() {
        document.title = "Moira - Trigger";
        this.loadData();
    }

    componentDidUpdate({ location: prevLocation }) {
        const { location: currentLocation } = this.props;
        if (!isEqual(prevLocation, currentLocation)) {
            this.loadData();
        }
    }

    static getEventMetricName(event: Event, triggerName: string): string {
        if (event.trigger_event) {
            return triggerName;
        }
        return event.metric.length !== 0 ? event.metric : "No metric evaluated";
    }

    static composeEvents(
        events: Array<Event>,
        triggerName: string
    ): {
        [key: string]: Array<Event>,
    } {
        return events.reduce((data, event) => {
            const metric = this.getEventMetricName(event, triggerName);
            if (data[metric]) {
                data[metric][0].push(event);
                // eslint-disable-next-line no-param-reassign
                data[metric][1] += 1;
            } else {
                data[metric] = [[event], 1]; // eslint-disable-line no-param-reassign
            }
            return data;
        }, {});
    }

    render() {
        const { loading, error, trigger, triggerState, triggerEvents } = this.state;
        const { view: TriggerView } = this.props;

        return (
            <TriggerView
                trigger={trigger}
                state={triggerState}
                events={triggerEvents}
                loading={loading}
                error={error}
                disableThrottling={this.disableThrottling}
                setTriggerMaintenance={this.setTriggerMaintenance}
                setMetricMaintenance={this.setMetricMaintenance}
                removeMetric={this.removeMetric}
                removeNoDataMetric={this.removeNoDataMetric}
            />
        );
    }

    async loadData() {
        const { moiraApi, match } = this.props;
        const { id } = match.params;

        // ToDo написать проверку id

        try {
            const [trigger, triggerState, triggerEvents] = await Promise.all([
                moiraApi.getTrigger(id),
                moiraApi.getTriggerState(id),
                moiraApi.getTriggerEvents(id),
            ]);

            document.title = `Moira - Trigger - ${trigger.name}`;

            this.setState({
                trigger,
                triggerState,
                triggerEvents: triggerEvents.list || [],
                loading: false,
            });
        } catch (error) {
            this.setState({ loading: false, error: error.message });
        }
    }

    disableThrottling = async (triggerId: string) => {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        await moiraApi.delThrottling(triggerId);
        this.loadData();
    };

    setTriggerMaintenance = async (triggerId: string, maintenance: Maintenance) => {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        await setTriggerMaintenance(moiraApi, triggerId, maintenance);
        this.loadData();
    };

    setMetricMaintenance = async (triggerId: string, metric: string, maintenance: Maintenance) => {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        await setMetricMaintenance(moiraApi, triggerId, metric, maintenance);
        this.loadData();
    };

    removeMetric = async (triggerId: string, metric: string) => {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        await moiraApi.delMetric(triggerId, metric);
        this.loadData();
    };

    removeNoDataMetric = async (triggerId: string) => {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        await moiraApi.delNoDataMetric(triggerId);
        this.loadData();
    };
}

export default withMoiraApi(TriggerPage);
