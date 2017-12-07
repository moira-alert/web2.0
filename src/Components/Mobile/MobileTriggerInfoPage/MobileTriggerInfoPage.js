// @flow
import * as React from "react";
import moment from "moment";
import Sticky from "retail-ui/components/Sticky";

import type { Schedule } from "../../../Domain/Schedule";
import type { Metric } from "../../../Domain/Metric";
import type { Trigger, TriggerState } from "../../../Domain/Trigger";
import type { Maintenance } from "../../../Domain/Maintenance";
import { Statuses } from "../../../Domain/Status";
import getStatusColor, { unknownColor } from "../Styles/StatusColor";

import MobileEmptyContentLoading from "../MobileEmptyContentLoading/MobileEmptyContentLoading";
import MobileMetricsList from "../MobileMetricsList/MobileMetricsList";
import MobileTriggerInfo from "../MobileTriggerInfo/MobileTriggerInfo";

import cn from "./MobileTriggerInfoPage.less";

type Props = {|
    data: ?Trigger,
    triggerState: ?TriggerState,
    metrics: ?{ [metric: string]: Metric },
    onRemoveMetric: (metricName: string) => void,
    loading: boolean,
    onSetMaintenance: (metricName: string, maintenancesInterval: Maintenance) => void,
    onThrottlingRemove: (triggerId: string) => void,
|};

function ScheduleView(props: { data: Schedule }): React.Node {
    const { days, startOffset, endOffset } = props.data;
    const enabledDays = days.filter(({ enabled }) => enabled);
    const viewDays = days.length === enabledDays.length ? "Everyday" : enabledDays.map(({ name }) => name).join(", ");
    const viewTime =
        moment("1900-01-01 00:00:00")
            .add(startOffset, "minutes")
            .format("HH:mm") +
        "–" +
        moment("1900-01-01 00:00:00")
            .add(endOffset, "minutes")
            .format("HH:mm");
    return (
        <span>
            {viewDays} {viewTime}
        </span>
    );
}

export default class MobileTriggerInfoPage extends React.Component<Props> {
    props: Props;

    getWorstTriggerState(): ?Status {
        const { data: trigger, triggerState } = this.props;
        if (trigger == null || triggerState == null) {
            return null;
        }
        const metrics = triggerState.metrics || {};
        const metricStatuses = Object.keys(Statuses).filter(x =>
            Object.keys(metrics)
                .map(x => metrics[x].state)
                .includes(x)
        );
        const notOkStatuses = metricStatuses.filter(x => x !== Statuses.OK);
        if (triggerState.state === Statuses.EXCEPTION) {
            return Statuses.EXCEPTION;
        } else if (metricStatuses.length === 0) {
            return trigger.triggerStatus;
        } else if (notOkStatuses.length === 0) {
            return Statuses.OK;
        } else if (notOkStatuses.includes(Statuses.ERROR)) {
            return Statuses.ERROR;
        } else if (notOkStatuses.includes(Statuses.WARN)) {
            return Statuses.WARN;
        }
        return null;
    }

    getCountsByStatus(): { [key: Status]: number } {
        const { triggerState } = this.props;
        const metrics = triggerState.metrics || {};

        return Object.keys(metrics)
            .map(x => metrics[x].state)
            .reduce((result, state) => {
                result[state] = (result[state] || 0) + 1;
                return result;
            }, {});
    }

    renderMetricsStats(): React.Node {
        const counts = this.getCountsByStatus();
        return (
            <span>
                Metrics:{" "}
                {Object.keys(Statuses)
                    .filter(x => counts[x])
                    .map(status => (
                        <span className={cn("metric-stats")}>
                            {status}:{" "}
                            <span style={{ color: getStatusColor(status) }} className={cn("value")}>
                                {counts[status]}
                            </span>
                        </span>
                    ))}
            </span>
        );
    }

    getHeaderColor(): string {
        const state = this.getWorstTriggerState();
        if (state == null) {
            return unknownColor;
        }
        return getStatusColor(state);
    }

    render(): React.Node {
        const {
            data: trigger,
            onSetMaintenance,
            triggerState,
            loading,
            onRemoveMetric,
            onThrottlingRemove,
            metrics,
        } = this.props;

        return (
            <div className={cn("root")}>
                <MobileTriggerInfo
                    data={trigger}
                    triggerState={triggerState}
                    loading={loading}
                    onThrottlingRemove={onThrottlingRemove}
                />
                <div className={cn("content")}>{trigger == null && loading && <MobileEmptyContentLoading />}</div>
                <div className={cn("metrics")}>
                    {metrics != null && (
                        <Sticky side="top" offset={55}>
                            <div className={cn("metrics-stats")}>{this.renderMetricsStats()}</div>
                        </Sticky>
                    )}
                    <div>
                        {metrics != null && (
                            <MobileMetricsList
                                metrics={metrics}
                                onRemove={onRemoveMetric}
                                onSetMaintenance={onSetMaintenance}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}
