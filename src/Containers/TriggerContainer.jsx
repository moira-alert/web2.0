// @flow
import * as React from "react";
import queryString from "query-string";
import Center from "retail-ui/components/Center";
import Paging from "retail-ui/components/Paging";
import type { ContextRouter } from "react-router-dom";
import type { IMoiraApi } from "../Api/MoiraApi";
import type { Trigger, TriggerState } from "../Domain/Trigger";
import type { Maintenance } from "../Domain/Maintenance";
import type { Metric } from "../Domain/Metric";
import type { Event } from "../Domain/Event";
import type { Config } from "../Domain/Config";
import type { SortingColum } from "../Components/MetricList/MetricList";
import { statusCode } from "../Api/MoiraApi";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import { setTriggerMaintenance, setMetricMaintenance } from "../Domain/Maintenance";
import { Statuses, getStatusWeight } from "../Domain/Status";
import TriggerInfo from "../Components/TriggerInfo/TriggerInfo";
import MetricList from "../Components/MetricList/MetricList";
import Tabs, { Tab } from "../Components/Tabs/Tabs";
import EventList from "../Components/EventList/EventList";
import Layout, { LayoutPlate, LayoutContent } from "../Components/Layout/Layout";
import { ColumnStack } from "../Components/ItemsStack/ItemsStack";

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {
    loading: boolean,
    error: ?string,
    config: ?Config,
    trigger: ?Trigger,
    triggerState: ?TriggerState,
    triggerEvents: ?{|
        total: number,
        list: Array<Event>,
        page: number,
        size: number,
    |},
    sortingColumn: SortingColum,
    sortingDown: boolean,
};

class TriggerContainer extends React.Component<Props, State> {
    props: Props;

    state: State = {
        loading: true,
        config: null,
        error: null,
        trigger: null,
        triggerState: null,
        triggerEvents: null,
        sortingColumn: "state",
        sortingDown: false,
    };

    componentDidMount() {
        document.title = "Moira - Trigger";
        this.getData(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
        this.setState({ loading: true });
        this.getData(nextProps);
    }

    static parseLocationSearch(search: string): { page: number } {
        const { page } = queryString.parse(search, { arrayFormat: "index" });
        return {
            page: typeof page === "string" ? Number(page.replace(/\D/g, "")) || 1 : 1,
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

    render(): React.Node {
        const {
            loading,
            error,
            trigger,
            triggerState,
            triggerEvents,
            sortingColumn,
            sortingDown,
            config,
        } = this.state;
        const { location } = this.props;
        const { page } = TriggerContainer.parseLocationSearch(location.search);
        const { metrics } = triggerState || {};
        const { list: events, total, size } = triggerEvents || {};
        const isMetrics = metrics && Object.keys(metrics).length > 0;
        const noDataMerticCount =
            (metrics &&
                Object.keys(metrics).filter(key => metrics[key].state === Statuses.NODATA)
                    .length) ||
            0;
        const isEvents = events && events.length > 0;
        const pageCount = Math.ceil(total / size) || 1;
        return (
            <Layout loading={loading} error={error}>
                {trigger != null && triggerState != null && config != null && (
                    <LayoutPlate>
                        <TriggerInfo
                            data={trigger}
                            triggerState={triggerState}
                            supportEmail={config.supportEmail}
                            onThrottlingRemove={triggerId => {
                                this.disableThrottling(triggerId);
                            }}
                            onSetMaintenance={maintenance => {
                                this.setTriggerMaintenance(trigger.id, maintenance);
                            }}
                        />
                    </LayoutPlate>
                )}
                {!(isMetrics || isEvents) && (
                    <LayoutContent>
                        <Center>
                            <span style={{ color: "#888888" }}>
                                There is no metrics evaluated for this trigger.
                            </span>
                        </Center>
                    </LayoutContent>
                )}
                {(isMetrics || isEvents) && (
                    <LayoutContent>
                        <Tabs value={isMetrics ? "state" : "events"}>
                            {isMetrics && trigger && (
                                <Tab id="state" label="Current state">
                                    <MetricList
                                        status
                                        items={this.sortMetrics(metrics)}
                                        onSort={sorting => {
                                            if (sorting === sortingColumn) {
                                                this.setState({ sortingDown: !sortingDown });
                                            } else {
                                                this.setState({
                                                    sortingColumn: sorting,
                                                    sortingDown: true,
                                                });
                                            }
                                        }}
                                        sortingColumn={sortingColumn}
                                        sortingDown={sortingDown}
                                        onChange={(maintenance, metric) => {
                                            this.setMetricMaintenance(
                                                trigger.id,
                                                maintenance,
                                                metric
                                            );
                                        }}
                                        onRemove={metric => {
                                            this.removeMetric(trigger.id, metric);
                                        }}
                                        noDataMerticCount={noDataMerticCount}
                                        onNoDataRemove={() => {
                                            this.removeNoDataMetric(trigger.id);
                                        }}
                                    />
                                </Tab>
                            )}
                            {isEvents && trigger != null && (
                                <Tab id="events" label="Events history">
                                    <ColumnStack block gap={6} horizontalAlign="stretch">
                                        <EventList
                                            items={TriggerContainer.composeEvents(
                                                events,
                                                trigger.name
                                            )}
                                        />
                                        {pageCount > 1 && (
                                            <Paging
                                                caption="Next page"
                                                activePage={page}
                                                pagesCount={pageCount}
                                                onPageChange={v =>
                                                    this.changeLocationSearch({ page: v })
                                                }
                                                withoutNavigationHint
                                            />
                                        )}
                                    </ColumnStack>
                                </Tab>
                            )}
                        </Tabs>
                    </LayoutContent>
                )}
            </Layout>
        );
    }

    async getData(props: Props) {
        const { moiraApi, match, location, history } = props;
        const { page } = TriggerContainer.parseLocationSearch(location.search);
        const { id } = match.params;
        if (typeof id !== "string") {
            this.setState({ error: "Wrong trigger id", loading: false });
            return;
        }
        try {
            const trigger = await moiraApi.getTrigger(id);
            const triggerState = await moiraApi.getTriggerState(id);
            const triggerEvents = await moiraApi.getTriggerEvents(id, page - 1);
            const config = await moiraApi.getConfig();

            if (
                page > Math.ceil(triggerEvents.total / triggerEvents.size) &&
                triggerEvents.total !== 0
            ) {
                const rightLastPage = Math.ceil(triggerEvents.total / triggerEvents.size) || 1;
                this.changeLocationSearch({ page: rightLastPage });
            }

            document.title = `Moira - Trigger - ${trigger.name}`;

            this.setState({
                config,
                trigger,
                triggerState,
                triggerEvents,
            });
        } catch (error) {
            if (error.status === statusCode.NOT_FOUND) {
                history.push("/404");
            } else {
                this.setState({ error: error.message });
            }
        } finally {
            this.setState({ loading: false });
        }
    }

    async disableThrottling(triggerId: string) {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        await moiraApi.delThrottling(triggerId);
        this.getData(this.props);
    }

    async setTriggerMaintenance(triggerId: string, maintenance: Maintenance) {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        await setTriggerMaintenance(moiraApi, triggerId, maintenance);
        this.getData(this.props);
    }

    async setMetricMaintenance(triggerId: string, maintenance: Maintenance, metric: string) {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        await setMetricMaintenance(moiraApi, triggerId, metric, maintenance);
        this.getData(this.props);
    }

    async removeMetric(triggerId: string, metric: string) {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        await moiraApi.delMetric(triggerId, metric);
        this.getData(this.props);
    }

    async removeNoDataMetric(triggerId: string) {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        await moiraApi.delNoDataMetric(triggerId);
        this.getData(this.props);
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
                const valueA =
                    Number.isFinite(metrics[x].value) && metrics[x].value != null
                        ? metrics[x].value
                        : Number.MIN_SAFE_INTEGER;
                const valueB =
                    Number.isFinite(metrics[y].value) && metrics[y].value != null
                        ? metrics[y].value
                        : Number.MIN_SAFE_INTEGER;
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
