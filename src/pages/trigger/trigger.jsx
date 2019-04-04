// @flow
import * as React from "react";
import moment from "moment";
import queryString from "query-string";
import type { ContextRouter } from "react-router-dom";
import isEqual from "lodash/isEqual";
import type { Trigger, TriggerState } from "../../Domain/Trigger";
import type { Event } from "../../Domain/Event";
import type { IMoiraApi } from "../../Api/MoiraApi";
import type { Maintenance } from "../../Domain/Maintenance";
import { withMoiraApi } from "../../Api/MoiraApiInjection";
import { getMaintenanceTime } from "../../Domain/Maintenance";
import transformPageFromHumanToProgrammer from "../../logic/transformPageFromHumanToProgrammer";

type Props = ContextRouter & { moiraApi: IMoiraApi };

type State = {
    loading: boolean,
    page: number,
    pageCount: number,
    trigger: ?Trigger,
    triggerState: ?TriggerState,
    triggerEvents: Array<Event>,
};

// ToDo решить, нужно ли подтягивать данные с сервера, если что-то изменилось

class TriggerPage extends React.Component<Props, State> {
    state: State = {
        loading: true,
        page: 1,
        pageCount: 1,
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

    static parseLocationSearch(search: string): MoiraUrlParams {
        const START_PAGE = 1;
        const { page } = queryString.parse(search);

        return {
            page: Number.isNaN(Number(page)) ? START_PAGE : Math.abs(parseInt(page, 10)),
        };
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
                data[metric].push(event);
            } else {
                data[metric] = [event]; // eslint-disable-line no-param-reassign
            }
            return data;
        }, {});
    }

    render() {
        const { loading, page, pageCount, trigger, triggerState, triggerEvents } = this.state;
        const { view: TriggerView } = this.props;

        return loading ? (
            <div>Loading...</div>
        ) : (
            <TriggerView
                trigger={trigger}
                state={triggerState}
                events={triggerEvents}
                page={page}
                pageCount={pageCount}
                disableTrhrottling={this.disableTrhrottling}
                setTriggerMaintenance={this.setTriggerMaintenance}
                setMetricMaintenance={this.setMetricMaintenance}
                removeMetric={this.removeMetric}
                removeNoDataMetric={this.removeNoDataMetric}
                onPageChange={this.changeLocationSearch}
            />
        );
    }

    async loadData() {
        const { moiraApi, match, location } = this.props;
        const { page } = TriggerPage.parseLocationSearch(location.search);
        const { id } = match.params;

        // ToDo написать проверку id

        try {
            const [trigger, triggerState, triggerEvents] = await Promise.all([
                moiraApi.getTrigger(id),
                moiraApi.getTriggerState(id),
                moiraApi.getTriggerEvents(id, transformPageFromHumanToProgrammer(page)),
            ]);

            const pageCount = Math.ceil(triggerEvents.total / triggerEvents.size);

            // ToDo написать проверку на превышение страниц

            document.title = `Moira - Trigger - ${trigger.name}`;

            this.setState({
                page,
                pageCount: Number.isNaN(pageCount) ? 1 : pageCount,
                trigger,
                triggerState,
                triggerEvents: triggerEvents.list || [],
            });
        } catch (error) {
            // ToDo
        } finally {
            this.setState({ loading: false });
        }
    }

    disableTrhrottling = async (triggerId: string) => {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        await moiraApi.delThrottling(triggerId);
        this.loadData();
    };

    // ToDo свести setTriggerMaintenance setMetricMaintenance и до одной функции
    setTriggerMaintenance = async (triggerId: string, maintenance: Maintenance) => {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        const maintenanceTime = getMaintenanceTime(maintenance);
        await moiraApi.setMaintenance(triggerId, {
            trigger:
                maintenanceTime > 0
                    ? moment
                          .utc()
                          .add(maintenanceTime, "minutes")
                          .unix()
                    : maintenanceTime,
        });
        this.loadData();
    };

    setMetricMaintenance = async (triggerId: string, metric: string, maintenance: Maintenance) => {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        const maintenanceTime = getMaintenanceTime(maintenance);
        await moiraApi.setMaintenance(triggerId, {
            metrics: {
                [metric]:
                    maintenanceTime > 0
                        ? moment
                              .utc()
                              .add(maintenanceTime, "minutes")
                              .unix()
                        : maintenanceTime,
            },
        });
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

    changeLocationSearch = update => {
        const { history, location } = this.props;
        const locationSearch = TriggerPage.parseLocationSearch(location.search);

        history.push(
            `?${queryString.stringify(
                { ...locationSearch, ...update },
                {
                    arrayFormat: "index",
                    encode: true,
                }
            )}`
        );
    };
}

export default withMoiraApi(TriggerPage);
