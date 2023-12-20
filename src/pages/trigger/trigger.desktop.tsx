import React, { ReactElement } from "react";
import { History } from "history";
import { Paging } from "@skbkontur/react-ui/components/Paging";
import { Center } from "@skbkontur/react-ui/components/Center";
import type { Trigger, TriggerState } from "../../Domain/Trigger";
import type { Event } from "../../Domain/Event";
import type { SortingColumn } from "../../Components/MetricList/MetricList";
import { Layout, LayoutPlate, LayoutContent } from "../../Components/Layout/Layout";
import Tabs, { Tab } from "../../Components/Tabs/Tabs";
import TriggerInfo from "../../Components/TriggerInfo/TriggerInfo";
import MetricList from "../../Components/MetricList/MetricList";
import EventList from "../../Components/EventList/EventList";
import { Status } from "../../Domain/Status";
import { sortMetrics } from "../../helpers/sort-metrics";
import { StateChart } from "../../Components/StateChart/StateChart";

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
    history: History;
};

type State = {
    sortingColumn: SortingColumn;
    sortingDown: boolean;
};

class TriggerDesktop extends React.Component<TriggerDesktopProps, State> {
    public state: State = {
        sortingColumn: "event",
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
                            history={this.props.history}
                        />
                    </LayoutPlate>
                )}
                <LayoutContent>
                    {isMetrics && (
                        <StateChart
                            displayLegend
                            enableTooltip
                            height={"10rem"}
                            width={"18rem"}
                            metrics={metrics}
                        />
                    )}
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
                                        items={sortMetrics(metrics, sortingColumn, sortingDown)}
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
}

export { TriggerDesktop as default };
