import * as React from "react";
import { useState, useCallback } from "react";
import { History } from "history";
import { format, fromUnixTime } from "date-fns";
import { Link as ReactRouterLink } from "react-router-dom";
import queryString from "query-string";
import ErrorIcon from "@skbkontur/react-icons/Error";
import FlagSolidIcon from "@skbkontur/react-icons/FlagSolid";
import { getPageLink } from "../../Domain/Global";
import { Trigger } from "../../Domain/Trigger";
import { MetricItemList } from "../../Domain/Metric";
import { Status, StatusesInOrder, getStatusColor, getStatusCaption } from "../../Domain/Status";
import RouterLink from "../RouterLink/RouterLink";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
import TagGroup from "../TagGroup/TagGroup";
import Tabs, { Tab } from "../Tabs/Tabs";
import MetricListView, { SortingColumn } from "../MetricList/MetricList";
import { sanitize } from "dompurify";
import { sortMetrics } from "../../helpers/sort-metrics";
import classNames from "classnames/bind";

import styles from "./TriggerListItem.less";

const cn = classNames.bind(styles);
import _ from "lodash";

type Props = {
    data: Trigger;
    searchMode: boolean;
    onChange?: (triggerId: string, metric: string, maintenance: number) => void;
    onRemove?: (metric: string) => void;
    history: History;
};

const TriggerListItem: React.FC<Props> = ({ data, searchMode, onChange, onRemove, history }) => {
    const [showMetrics, setShowMetrics] = useState(false);
    const [sortingColumn, setSortingColumn] = useState<SortingColumn>("event");
    const [sortingDown, setSortingDown] = useState(false);

    const metrics = data.last_check?.metrics;

    const handleToggleMetrics = useCallback(() => {
        setShowMetrics((prev) => !prev);
    }, []);

    const handleSort = useCallback(
        (column: SortingColumn) => {
            if (column === sortingColumn) {
                setSortingDown((prev) => !prev);
            } else {
                setSortingColumn(column);
                setSortingDown(true);
            }
        },
        [sortingColumn]
    );

    const getHasExceptionState = () => data.last_check?.state === Status.EXCEPTION;

    const filterMetricsByStatus = (status: Status): MetricItemList =>
        _.pickBy(metrics, (metric) => metric.state === status);

    const renderCounters = (): React.ReactElement => {
        const counters = StatusesInOrder.map((status) => ({
            status,
            count: Object.keys(filterMetricsByStatus(status)).length,
        }))
            .filter(({ count }) => count !== 0)
            .map(({ status, count }) => (
                <span key={status} style={{ color: getStatusColor(status) }}>
                    {count}
                </span>
            ));
        return (
            <div className={cn("counters")}>
                {counters.length !== 0 ? counters : <span className={cn("NA")}>N/A</span>}
            </div>
        );
    };

    const renderStatus = (): React.ReactElement => {
        const triggerStatus = data.last_check?.state;
        const metricStatuses = StatusesInOrder.filter(
            (x) => Object.keys(filterMetricsByStatus(x)).length !== 0
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
        const hasExpression = data.expression != null && data.expression !== "";
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
                {getHasExceptionState() && renderExceptionHelpMessage()}
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
                onClick={() => metrics && handleToggleMetrics()}
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
                                        __html: sanitize(searchModeName || data.name),
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
                            history.push(
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
