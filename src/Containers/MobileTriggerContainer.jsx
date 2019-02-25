// @flow
import * as React from "react";
import moment from "moment";
import queryString from "query-string";
import type { ContextRouter } from "react-router-dom";
import type { IMoiraApi } from "../Api/MoiraApi";
import type { Trigger, TriggerState } from "../Domain/Trigger";
import type { Maintenance } from "../Domain/Maintenance";
import type { Metric } from "../Domain/Metric";
import type { Event } from "../Domain/Event";
import type { SortingColum } from "../Components/MetricList/MetricList";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import { getMaintenanceTime } from "../Domain/Maintenance";
import { getStatusWeight } from "../Domain/Status";
import MobileTriggerInfoPage from "../Components/Mobile/MobileTriggerInfoPage/MobileTriggerInfoPage";

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {
    loading: boolean,
    trigger: ?Trigger,
    triggerState: ?TriggerState,
    sortingColumn: SortingColum,
    sortingDown: boolean,
};

class TriggerContainer extends React.Component<Props, State> {
    props: Props;

    state: State = {
        loading: true,
        trigger: null,
        triggerState: null,
        sortingColumn: "value",
        sortingDown: true,
    };

    componentDidMount() {
        document.title = "Moira - Trigger";
        this.getData(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
        this.setState({ loading: true });
        this.getData(nextProps);
    }

    static composeEvents(
        events: Array<Event>
    ): {
        [key: string]: Array<Event>,
    } {
        return events.reduce((data: { [key: string]: Array<Event> }, event: Event) => {
            const metric = event.metric.length !== 0 ? event.metric : "No metric evaluated";
            if (data[metric]) {
                data[metric].push(event);
            } else {
                data[metric] = [event]; // eslint-disable-line no-param-reassign
            }
            return data;
        }, {});
    }

    static parseLocationSearch(search: string): { page: number } {
        const location = queryString.parse(search, { arrayFormat: "index" });
        const { page } = location;
        return {
            page: typeof page === "string" ? Number(page.replace(/\D/g, "")) || 1 : 1,
        };
    }

    render(): React.Node {
        const { loading, trigger, triggerState } = this.state;
        const { metrics } = triggerState || {};

        return (
            <MobileTriggerInfoPage
                loading={loading}
                data={trigger}
                triggerState={triggerState}
                onRemoveMetric={x => {
                    this.handleRemoveMetric(x);
                }}
                onThrottlingRemove={() => {
                    this.disableTrhrottling();
                }}
                onSetMetricMaintenance={(x, y) => {
                    this.handleSetMetricMaintenance(x, y);
                }}
                onSetTriggerMaintenance={x => {
                    this.handleSetTriggerMaintenance(x);
                }}
                metrics={metrics}
            />
        );
    }

    handleRemoveMetric = async (metric: string) => {
        const { moiraApi, match } = this.props;
        const { id } = match.params;
        if (typeof id !== "string") {
            return;
        }
        await moiraApi.delMetric(id, metric);
        this.getData(this.props);
    };

    handleSetMetricMaintenance = async (metric: string, maintenanceInterval: Maintenance) => {
        const { match } = this.props;
        const { id } = match.params;
        if (typeof id !== "string") {
            return;
        }
        await this.setMetricMaintenance(id, maintenanceInterval, metric);
        this.getData(this.props);
    };

    handleSetTriggerMaintenance = async (maintenanceInterval: Maintenance) => {
        const { match } = this.props;
        const { id } = match.params;
        if (typeof id !== "string") {
            return;
        }
        await this.setTriggerMaintenance(id, maintenanceInterval);
        this.getData(this.props);
    };

    async getData(props: Props) {
        const { moiraApi, match, location } = props;
        const { page } = TriggerContainer.parseLocationSearch(location.search);
        const { id } = match.params;
        if (typeof id !== "string") {
            this.setState({ loading: false });
            return;
        }
        try {
            const trigger = await moiraApi.getTrigger(id);
            const triggerState = await moiraApi.getTriggerState(id);
            const triggerEvents = await moiraApi.getTriggerEvents(id, page - 1);

            if (
                page > Math.ceil(triggerEvents.total / triggerEvents.size) &&
                triggerEvents.total !== 0
            ) {
                const rightLastPage = Math.ceil(triggerEvents.total / triggerEvents.size) || 1;
                this.changeLocationSearch({ page: rightLastPage });
                return;
            }

            document.title = `Moira - Trigger - ${trigger.name}`;

            this.setState({
                trigger,
                triggerState,
            });
        } catch (error) {
            // ToDo обработать ошибку
        } finally {
            this.setState({ loading: false });
        }
    }

    async disableTrhrottling() {
        const { trigger } = this.state;
        const { moiraApi, match } = this.props;
        const { id } = match.params;
        if (typeof id !== "string") {
            return;
        }
        await moiraApi.delThrottling(id);
        this.setState({
            trigger: {
                ...trigger,
                throttling: 0,
            },
        });
        this.getData(this.props);
    }

    async removeMetric(triggerId: string, metric: string) {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        await moiraApi.delMetric(triggerId, metric);
        this.getData(this.props);
    }

    async setMetricMaintenance(triggerId: string, maintenance: Maintenance, metric: string) {
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
    }

    async setTriggerMaintenance(triggerId: string, maintenance: Maintenance) {
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
    }

    changeLocationSearch(update: { page: number }) {
        const { location, history } = this.props;
        const search = {
            ...TriggerContainer.parseLocationSearch(location.search),
            ...update,
        };
        history.push(
            `?${queryString.stringify(search, {
                arrayFormat: "index",
                encode: true,
            })}`
        );
    }

    sortMetrics(metrics: { [metric: string]: Metric }): { [metric: string]: Metric } {
        const { sortingColumn, sortingDown } = this.state;
        const sorting = {
            state: (x, y) => {
                const stateA = getStatusWeight(metrics[x].state);
                const stateB = getStatusWeight(metrics[y].state);
                if (stateA < stateB) {
                    return sortingDown ? -1 : 1;
                }
                if (stateA > stateB) {
                    return sortingDown ? 1 : -1;
                }
                return 0;
            },
            name: (x, y) => {
                const regex = /[^a-zA-Z0-9-.]/g;
                const nameA = x
                    .trim()
                    .replace(regex, "")
                    .toLowerCase();
                const nameB = y
                    .trim()
                    .replace(regex, "")
                    .toLowerCase();
                if (nameA < nameB) {
                    return sortingDown ? -1 : 1;
                }
                if (nameA > nameB) {
                    return sortingDown ? 1 : -1;
                }
                return 0;
            },
            event: (x, y) => {
                const eventA = metrics[x].event_timestamp || 0;
                const eventB = metrics[y].event_timestamp || 0;
                if (eventA < eventB) {
                    return sortingDown ? -1 : 1;
                }
                if (eventA > eventB) {
                    return sortingDown ? 1 : -1;
                }
                return 0;
            },
            value: (x, y) => {
                const valueA = metrics[x].value || 0;
                const valueB = metrics[y].value || 0;
                if (valueA < valueB) {
                    return sortingDown ? -1 : 1;
                }
                if (valueA > valueB) {
                    return sortingDown ? 1 : -1;
                }
                return 0;
            },
        };
        return Object.keys(metrics)
            .sort(sorting[sortingColumn])
            .reduce((data, key) => ({ ...data, [key]: metrics[key] }), {});
    }
}

export default withMoiraApi(TriggerContainer);
