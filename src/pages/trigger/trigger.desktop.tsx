import React, { ReactElement } from "react";
import { Paging } from "@skbkontur/react-ui/components/Paging";
import { Center } from "@skbkontur/react-ui/components/Center";
import type { Trigger, TriggerState } from "../../Domain/Trigger";
import type { Event } from "../../Domain/Event";
import type { SortingColumn } from "../../Components/MetricList/MetricList";
import Layout, { LayoutPlate, LayoutContent } from "../../Components/Layout/Layout";
import Tabs, { Tab } from "../../Components/Tabs/Tabs";
import TriggerInfo from "../../Components/TriggerInfo/TriggerInfo";
import MetricList from "../../Components/MetricList/MetricList";
import EventList from "../../Components/EventList/EventList";
import { Status, getStatusWeight } from "../../Domain/Status";
import type { Metric } from "../../Domain/Metric";

export type TriggerDesktopProps = {
    trigger?: Trigger;
    state?: TriggerState;
    events: Array<Event>;
    page: number;
    pageCount: number;
    disableThrottling: (id: string) => void;
    setTriggerMaintenance: (id: string, maintenance: number) => void;
    setMetricMaintenance: (id: string, metric: string, maintenance: number) => void;
    removeMetric: (id: string, metric: string) => void;
    removeNoDataMetric: (id: string) => void;
    onPageChange: (updatePage: { page: number }) => void;
    loading: boolean;
    error?: string;
};

type State = {
    sortingColumn: SortingColumn;
    sortingDown: boolean;
};

class TriggerDesktop extends React.Component<TriggerDesktopProps, State> {
    public state: State = {
        sortingColumn: "state",
        sortingDown: false,
    };

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
        [key: string]: Array<Event>;
    } {
        return events.reduce((data: { [key: string]: Array<Event> }, event: Event) => {
            const metric = this.getEventMetricName(event, triggerName);
            if (data[metric]) {
                data[metric].push(event);
            } else {
                data[metric] = [event];
            }
            return data;
        }, {});
    }

    public render(): ReactElement {
        const { sortingColumn, sortingDown } = this.state;
        const {
            trigger,
            state,
            events,
            page,
            pageCount,
            disableThrottling,
            setTriggerMaintenance,
            setMetricMaintenance,
            removeMetric,
            removeNoDataMetric,
            onPageChange,
            loading,
            error,
        } = this.props;
        const { metrics } = state || {};
        const isMetrics = metrics && Object.keys(metrics).length > 0;
        const isEvents = events && events.length > 0;
        const triggerId = trigger ? trigger.id : "";
        const noDataMetricCount =
            (metrics &&
                Object.keys(metrics).filter((key) => metrics[key].state === Status.NODATA)
                    .length) ||
            0;

        return (
            <Layout loading={loading} error={error}>
                {trigger && state && (
                    <LayoutPlate>
                        <TriggerInfo
                            data={trigger}
                            triggerState={state}
                            onThrottlingRemove={() => disableThrottling(trigger.id)}
                            onSetMaintenance={(maintenance) =>
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
                        <Tabs value={isMetrics ? (page > 1 ? "events" : "state") : "state"}>
                            {metrics && isMetrics && triggerId ? (
                                <Tab id="state" label="Current state">
                                    <MetricList
                                        status
                                        items={this.sortMetrics(metrics)}
                                        onSort={(sorting) => {
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
                                            setMetricMaintenance(triggerId, metric, maintenance);
                                        }}
                                        onRemove={(metric) => removeMetric(triggerId, metric)}
                                        noDataMetricCount={noDataMetricCount}
                                        onNoDataRemove={() => removeNoDataMetric(triggerId)}
                                    />
                                </Tab>
                            ) : null}
                            {isEvents && trigger && trigger.name ? (
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
                                                onPageChange={(newPage) =>
                                                    onPageChange({ page: newPage })
                                                }
                                                withoutNavigationHint
                                            />
                                        </div>
                                    )}
                                </Tab>
                            ) : null}
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
            state: (x: string, y: string) => {
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
            name: (x: string, y: string) => {
                const regex = /[^a-zA-Z0-9-.]/g;
                const nameA = x.trim().replace(regex, "").toLowerCase();
                const nameB = y.trim().replace(regex, "").toLowerCase();
                if (nameA < nameB) {
                    return sortingDown ? -1 : 1;
                }
                if (nameA > nameB) {
                    return sortingDown ? 1 : -1;
                }
                return 0;
            },
            event: (x: string, y: string) => {
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
            value: (x: string, y: string) => {
                const getValue = (value?: number) =>
                    Number.isFinite(value) && value != null ? value : Number.MIN_SAFE_INTEGER;

                const xValues = metrics[x].values;
                const yValues = metrics[y].values;
                const xKeys = xValues ? Object.keys(xValues) : [];
                const yKeys = yValues ? Object.keys(yValues) : [];
                const maxKeysCount = Math.max(xKeys.length, yKeys.length);

                for (let i = 0; i < maxKeysCount; i += 1) {
                    const valueA =
                        xKeys.length > i && xValues
                            ? getValue(xValues[xKeys[i]])
                            : Number.MIN_SAFE_INTEGER;
                    const valueB =
                        yKeys.length > i && yValues
                            ? getValue(yValues[yKeys[i]])
                            : Number.MIN_SAFE_INTEGER;

                    if (valueA < valueB) {
                        return sortingDown ? -1 : 1;
                    }
                    if (valueA > valueB) {
                        return sortingDown ? 1 : -1;
                    }
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
