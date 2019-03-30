// @flow
import * as React from "react";
import Paging from "retail-ui/components/Paging";
import Center from "retail-ui/components/Center";
import type { Trigger, TriggerState } from "../../Domain/Trigger";
import type { Event } from "../../Domain/Event";
import type { SortingColum } from "../../Components/MetricList/MetricList";
import type { Maintenance } from "../../Domain/Maintenance";
import Layout, { LayoutPlate, LayoutContent } from "../../Components/Layout/Layout";
import Tabs, { Tab } from "../../Components/Tabs/Tabs";
import TriggerInfo from "../../Components/TriggerInfo/TriggerInfo";
import MetricList from "../../Components/MetricList/MetricList";
import EventList from "../../Components/EventList/EventList";
import { Statuses, getStatusWeight } from "../../Domain/Status";

type Props = {|
    trigger: ?Trigger,
    state: ?TriggerState,
    events: Array<Event>,
    page: number,
    pageCount: number,
    disableTrhrottling: (id: string) => void,
    setTriggerMaintenance: (id: string, maintenance: Maintenance) => void,
    setMetricMaintenance: (id: string, maintenance: Maintenance, metric: string) => void,
    removeMetric: (id: string, metric: string) => void,
    removeNoDataMetric: (id: string) => void,
    onPageChange: ({ page: number }) => {},
|};

type State = {
    sortingColumn: SortingColum,
    sortingDown: boolean,
};

class TriggerDesktop extends React.Component<Props, State> {
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            sortingColumn: "state",
            sortingDown: false,
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
        const { sortingColumn, sortingDown } = this.state;
        const {
            trigger,
            state,
            events,
            page,
            pageCount,
            disableTrhrottling,
            setTriggerMaintenance,
            setMetricMaintenance,
            removeMetric,
            removeNoDataMetric,
            onPageChange,
        } = this.props;
        const { metrics } = state;
        const isMetrics = metrics && Object.keys(metrics).length > 0;
        const isEvents = events && events.length > 0;
        const noDataMerticCount =
            (metrics &&
                Object.keys(metrics).filter(key => metrics[key].state === Statuses.NODATA)
                    .length) ||
            0;

        return (
            <Layout>
                {trigger && state && (
                    <LayoutPlate>
                        <TriggerInfo
                            data={trigger}
                            triggerState={state}
                            onThrottlingRemove={() => disableTrhrottling(trigger.id)}
                            onSetMaintenance={maintenance =>
                                setTriggerMaintenance(trigger.id, maintenance)
                            }
                        />
                    </LayoutPlate>
                )}
                <LayoutContent>
                    {!(isMetrics || isEvents) ? (
                        <Center>
                            <span style={{ color: "#888888" }}>
                                There is no metrics evaluated for this trigger.
                            </span>
                        </Center>
                    ) : (
                        // eslint-disable-next-line no-nested-ternary
                        <Tabs value={isMetrics ? (page > 1 ? "events" : "state") : "state"}>
                            {isMetrics && trigger.id && (
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
                                        onChange={(metric, maintenance) => {
                                            setMetricMaintenance(trigger.id, metric, maintenance);
                                        }}
                                        onRemove={metric => removeMetric(trigger.id, metric)}
                                        noDataMerticCount={noDataMerticCount}
                                        onNoDataRemove={() => removeNoDataMetric(trigger.id)}
                                    />
                                </Tab>
                            )}
                            {isEvents && trigger.name && (
                                <Tab id="events" label="Events history">
                                    <EventList
                                        items={TriggerDesktop.composeEvents(events, trigger.name)}
                                    />
                                    {pageCount > 1 && (
                                        <div style={{ paddingTop: 20 }}>
                                            <Paging
                                                caption="Next page"
                                                activePage={page}
                                                pagesCount={pageCount}
                                                onPageChange={newPage =>
                                                    onPageChange({ page: newPage })
                                                }
                                                withoutNavigationHint
                                            />
                                        </div>
                                    )}
                                </Tab>
                            )}
                        </Tabs>
                    )}
                </LayoutContent>
            </Layout>
        );
    }

    // ToDo вместо пересортировки по одному и тому же параметру сделать reverse
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

export { TriggerDesktop as default };
