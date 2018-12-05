// @flow
import * as React from "react";
import moment from "moment";
import queryString from "query-string";
import Center from "retail-ui/components/Center";
import type { ContextRouter } from "react-router-dom";
import type { IMoiraApi } from "../Api/MoiraAPI";
import type { Trigger, TriggerState } from "../Domain/Trigger";
import type { Maintenance } from "../Domain/Maintenance";
import type { Metric } from "../Domain/Metric";
import type { Event } from "../Domain/Event";
import type { Config } from "../Domain/Config";
import type { SortingColum } from "../Components/MetricList/MetricList";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import { getMaintenanceTime } from "../Domain/Maintenance";
import { getStatusWeight } from "../Domain/Status";
import TriggerInfo from "../Components/TriggerInfo/TriggerInfo";
import MetricList from "../Components/MetricList/MetricList";
import Tabs, { Tab } from "../Components/Tabs/Tabs";
import EventList from "../Components/EventList/EventList";
import Layout, { LayoutPlate, LayoutContent } from "../Components/Layout/Layout";
import { ColumnStack } from "../Components/ItemsStack/ItemsStack";
import Paging from "../Components/Paging/Paging";
import cn from "./TriggerContainer.less";

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
        this.getData(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
        this.setState({ loading: true });
        this.getData(nextProps);
    }

    async getData(props: Props): Promise<void> {
        const { moiraApi, match, location } = props;
        const { page } = this.parseLocationSearch(location.search);
        const { id } = match.params;
        if (typeof id !== "string") {
            return;
        }
        try {
            const trigger = await moiraApi.getTrigger(id);
            const triggerState = await moiraApi.getTriggerState(id);
            const triggerEvents = await moiraApi.getTriggerEvents(id, page - 1);
            const config = await moiraApi.getConfig();

            if (page > Math.ceil(triggerEvents.total / triggerEvents.size) && triggerEvents.total !== 0) {
                const rightLastPage = Math.ceil(triggerEvents.total / triggerEvents.size) || 1;
                this.changeLocationSearch({ page: rightLastPage });
                return;
            }

            this.setState({
                loading: false,
                config: config,
                trigger,
                triggerState,
                triggerEvents,
            });
        } catch (error) {
            this.setState({ error: error.message });
        }
    }

    async disableTrhrottling(triggerId: string): Promise<void> {
        this.setState({ loading: true });
        await this.props.moiraApi.delThrottling(triggerId);
        this.getData(this.props);
    }

    async setTriggerMaintenance(triggerId: string, maintenance: Maintenance): Promise<void> {
        this.setState({ loading: true });
        const maintenanceTime = getMaintenanceTime(maintenance);
        await this.props.moiraApi.setMaintenance(triggerId, {
            trigger:
                maintenanceTime > 0
                    ? moment
                          .utc()
                          .add(maintenanceTime, "minutes")
                          .unix()
                    : maintenanceTime,
        });
        this.getData(this.props);
    }

    async setMetricMaintenance(triggerId: string, maintenance: Maintenance, metric: string): Promise<void> {
        this.setState({ loading: true });
        const maintenanceTime = getMaintenanceTime(maintenance);
        await this.props.moiraApi.setMaintenance(triggerId, {
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
        this.getData(this.props);
    }

    async removeMetric(triggerId: string, metric: string): Promise<void> {
        this.setState({ loading: true });
        await this.props.moiraApi.delMetric(triggerId, metric);
        this.getData(this.props);
    }

    async removeNoDataMetric(triggerId: string): Promise<void> {
        this.setState({ loading: true });
        await this.props.moiraApi.delNoDataMetric(triggerId);
        this.getData(this.props);
    }

    parseLocationSearch(search: string): { page: number } {
        const {
            page,
        }: {
            [key: string]: string | Array<string>,
        } = queryString.parse(search, { arrayFormat: "index" });
        return {
            page: typeof page === "string" ? Number(page.replace(/\D/g, "")) || 1 : 1,
        };
    }

    changeLocationSearch(update: { page: number }) {
        const { location, history } = this.props;
        const search = {
            ...this.parseLocationSearch(location.search),
            ...update,
        };
        history.push(
            "?" +
                queryString.stringify(search, {
                    arrayFormat: "index",
                    encode: true,
                })
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
                    isFinite(metrics[x].value) && metrics[x].value != null ? metrics[x].value : Number.MIN_SAFE_INTEGER;
                const valueB =
                    isFinite(metrics[y].value) && metrics[y].value != null ? metrics[y].value : Number.MIN_SAFE_INTEGER;
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
            .reduce((data, key) => {
                return { ...data, [key]: metrics[key] };
            }, {});
    }

    composeEvents(
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
                data[metric] = [event];
            }
            return data;
        }, {});
    }

    getEventMetricName(event: Event, triggerName: string): string {
        if (event.trigger_event) {
            return triggerName;
        }
        return event.metric.length !== 0 ? event.metric : "No metric evaluated";
    }

    render(): React.Node {
        const { loading, error, trigger, triggerState, triggerEvents, sortingColumn, sortingDown, config } = this.state;
        const { location } = this.props;
        const { page } = this.parseLocationSearch(location.search);
        const { metrics } = triggerState || {};
        const { list: events, total, size } = triggerEvents || {};
        const isMetrics = metrics && Object.keys(metrics).length > 0;
        const isEvents = events && events.length > 0;
        const pageCount = Math.ceil(total / size) || 1;
        return (
            <Layout loading={loading} error={error}>
                {trigger != null &&
                    triggerState != null &&
                    config != null && (
                        <LayoutPlate>
                            <TriggerInfo
                                data={trigger}
                                triggerState={triggerState}
                                supportEmail={config.supportEmail}
                                onThrottlingRemove={triggerId => {
                                    this.disableTrhrottling(triggerId);
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
                            <span className={cn("empty-details-text")}>
                                There is no metrics evaluated for this trigger.
                            </span>
                        </Center>
                    </LayoutContent>
                )}
                {(isMetrics || isEvents) && (
                    <LayoutContent>
                        <Tabs value={isMetrics ? "state" : "events"}>
                            {isMetrics &&
                                trigger && (
                                    <Tab id="state" label="Current state">
                                        <MetricList
                                            status
                                            items={this.sortMetrics(metrics)}
                                            onSort={sorting => {
                                                if (sorting === sortingColumn) {
                                                    this.setState({ sortingDown: !sortingDown });
                                                } else {
                                                    this.setState({ sortingColumn: sorting, sortingDown: true });
                                                }
                                            }}
                                            sortingColumn={sortingColumn}
                                            sortingDown={sortingDown}
                                            onChange={(maintenance, metric) => {
                                                this.setMetricMaintenance(trigger.id, maintenance, metric);
                                            }}
                                            onRemove={metric => {
                                                this.removeMetric(trigger.id, metric);
                                            }}
                                            onNoDataRemove={() => {
                                                this.removeNoDataMetric(trigger.id);
                                            }}
                                        />
                                    </Tab>
                                )}
                            {isEvents &&
                                trigger != null && (
                                    <Tab id="events" label="Events history">
                                        <ColumnStack block gap={6} horizontalAlign="stretch">
                                            <EventList items={this.composeEvents(events, trigger.name)} />
                                            {pageCount > 1 && (
                                                <Paging
                                                    activePage={page}
                                                    pagesCount={pageCount}
                                                    onPageChange={page => this.changeLocationSearch({ page })}
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
}

export default withMoiraApi(TriggerContainer);
