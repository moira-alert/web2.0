import * as React from "react";
import { useState, useMemo } from "react";
import { format, fromUnixTime } from "date-fns";
import { Link as ReactRouterLink, useNavigate } from "react-router-dom";
import queryString from "query-string";
import ErrorIcon from "@skbkontur/react-icons/Error";
import FlagSolidIcon from "@skbkontur/react-icons/FlagSolid";
import { getPageLink } from "../../Domain/Global";
import { Trigger } from "../../Domain/Trigger";
import { MetricItemList, withMuted, withoutMuted } from "../../Domain/Metric";
import { Status, StatusesInOrder, getStatusColor, getStatusCaption } from "../../Domain/Status";
import RouterLink from "../RouterLink/RouterLink";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
import TagGroup from "../TagGroup/TagGroup";
import Tabs, { Tab } from "../Tabs/Tabs";
import MetricListView, { SortingColumn } from "../MetricList/MetricList";
import DOMPurify from "dompurify";
import { sortMetrics } from "../../helpers/sort-metrics";
import _ from "lodash";
import NotificationBellOff from "@skbkontur/react-icons/NotificationBellOff";
import classNames from "classnames/bind";

import styles from "./TriggerListItem.module.less";

const cn = classNames.bind(styles);

type Props = {
    data: Trigger;
    searchMode: boolean;
    onChange?: (triggerId: string, metric: string, maintenance: number) => void;
    onRemove?: (metric: string) => void;
};

const TriggerListItem: React.FC<Props> = ({ data, searchMode, onChange, onRemove }) => {
    const [showMetrics, setShowMetrics] = useState(false);
    const [sortingColumn, setSortingColumn] = useState<SortingColumn>("event");
    const [sortingDown, setSortingDown] = useState(false);
    const navigate = useNavigate();

    const metrics = data.last_check?.metrics;

    const handleSort = (column: SortingColumn) => {
        if (column === sortingColumn) {
            setSortingDown((prev) => !prev);
        } else {
            setSortingColumn(column);
            setSortingDown(true);
        }
    };

    const hasExceptionState = data.last_check?.state === Status.EXCEPTION;

    const mutedMetrics = useMemo(() => withMuted(metrics), [metrics]);

    const filterMetricsByStatus = useMemo(
        () => (status: Status): MetricItemList =>
            _.pickBy(metrics, (metric) => metric.state === status),
        [metrics]
    );

    const renderCounters = (): React.ReactElement => {
        const mutedMetricsCount = Object.keys(mutedMetrics).length;

        const activeMetricsCounters = StatusesInOrder.map((status) => {
            const count = Object.values(withoutMuted(metrics)).filter(
                (metric) => metric.state === status
            ).length;
            return { status, count };
        })
            .filter(({ count }) => count !== 0)
            .map(({ status, count }) => (
                <span key={status} style={{ color: getStatusColor(status) }}>
                    {count}
                </span>
            ));

        return (
            <div className={cn("counters")}>
                {activeMetricsCounters.length !== 0 ? (
                    activeMetricsCounters
                ) : (
                    <span className={cn("NA")}>N/A</span>
                )}
                {mutedMetricsCount > 0 && (
                    <span className={cn("mutedMetricsCount")}>
                        {mutedMetricsCount} <NotificationBellOff />
                    </span>
                )}
            </div>
        );
    };

    const renderStatus = (): React.ReactElement => {
        const triggerStatus = data.last_check?.state;

        const metricStatuses = StatusesInOrder.filter((status) =>
            Object.values(withoutMuted(metrics)).some((metric) => metric.state === status)
        );

        const notOkStatuses = metricStatuses.filter((x) => x !== Status.OK);

        const statuses =
            triggerStatus && (triggerStatus !== Status.OK || metricStatuses.length === 0)
                ? [triggerStatus]
                : notOkStatuses.length !== 0
                ? notOkStatuses
                : [Status.OK];

        return (
            <div className={cn("indicator")}>
                <StatusIndicator statuses={statuses} />
            </div>
        );
    };

    const renderExceptionHelpMessage = (): React.ReactElement => {
        const hasExpression = !!data.expression;
        const hasMultipleTargets = data.targets.length > 1;
        return (
            <div className={cn("exception-message")}>
                <ErrorIcon color="#D43517" /> Trigger in EXCEPTION state. Please{" "}
                <RouterLink to={`/trigger/${data.id}/edit`}>verify</RouterLink> trigger target
                {hasMultipleTargets ? "s" : ""}
                {hasExpression ? " and expression" : ""} on{" "}
                <RouterLink to={`/trigger/${data.id}/edit`}>trigger edit page</RouterLink>.{" "}
                <RouterLink to={`/trigger/${data.id}`}>See more details</RouterLink> on trigger
                page.
            </div>
        );
    };

    const renderMetrics = (): React.ReactNode => {
        if (!onChange || !onRemove) return null;
        const statuses = StatusesInOrder.filter(
            (x) => Object.keys(filterMetricsByStatus(x)).length !== 0
        );
        if (statuses.length === 0) return null;

        return (
            <div className={cn("metrics")}>
                {hasExceptionState && renderExceptionHelpMessage()}
                <Tabs value={statuses[0]}>
                    {statuses.map((status) => (
                        <Tab key={status} id={status} label={getStatusCaption(status)}>
                            <MetricListView
                                items={sortMetrics(
                                    filterMetricsByStatus(status),
                                    sortingColumn,
                                    sortingDown
                                )}
                                sortingColumn={sortingColumn}
                                onSort={handleSort}
                                sortingDown={sortingDown}
                                onChange={(metric, maintenance) =>
                                    onChange?.(data.id, metric, maintenance)
                                }
                                onRemove={onRemove}
                            />
                        </Tab>
                    ))}
                </Tabs>
            </div>
        );
    };

    const searchModeName = data.highlights?.name;

    return (
        <div className={cn("row", { active: showMetrics })}>
            <div
                className={cn("state", { active: metrics })}
                onClick={() => metrics && setShowMetrics((prev) => !prev)}
                data-tid="TriggerListItem_status"
            >
                {renderStatus()}
                {renderCounters()}
            </div>
            <div className={cn("data")}>
                <ReactRouterLink
                    className={cn("header")}
                    to={getPageLink("trigger", data.id)}
                    data-tid="TriggerListItem_header"
                >
                    <div className={cn("link")}>
                        <div className={cn("title")}>
                            {searchMode ? (
                                <div
                                    className={cn("name")}
                                    dangerouslySetInnerHTML={{
                                        __html: DOMPurify.sanitize(searchModeName || data.name),
                                    }}
                                />
                            ) : (
                                <div className={cn("name")}>{data.name}</div>
                            )}
                            {data.throttling !== 0 && (
                                <div
                                    className={cn("flag")}
                                    title={`Throttling until ${format(
                                        fromUnixTime(data.throttling),
                                        "MMMM d, HH:mm:ss"
                                    )}`}
                                >
                                    <FlagSolidIcon />
                                </div>
                            )}
                        </div>
                        <div className={cn("targets")}>
                            {data.targets.map((target) => (
                                <div key={target} className={cn("target")}>
                                    {target}
                                </div>
                            ))}
                        </div>
                    </div>
                </ReactRouterLink>
                <div className={cn("tags")}>
                    <TagGroup
                        onClick={(tag) =>
                            navigate(
                                `/?${queryString.stringify(
                                    { tags: [tag] },
                                    { arrayFormat: "index", encode: true }
                                )}`
                            )
                        }
                        tags={data.tags}
                    />
                </div>
                {showMetrics && <div className={cn("metrics")}>{renderMetrics()}</div>}
            </div>
        </div>
    );
};

export default TriggerListItem;
