import * as React from "react";
import { Sticky } from "@skbkontur/react-ui/components/Sticky";

import { MetricList } from "../../../Domain/Metric";
import { Status } from "../../../Domain/Status";
import { Trigger, TriggerState } from "../../../Domain/Trigger";
import { Statuses } from "../../../Domain/Status";
import getStatusColor from "../Styles/StatusColor";

import MobileEmptyContentLoading from "../MobileEmptyContentLoading/MobileEmptyContentLoading";
import MobileMetricsList from "../MobileMetricsList/MobileMetricsList";
import MobileTriggerInfo from "../MobileTriggerInfo/MobileTriggerInfo";

import cn from "./MobileTriggerInfoPage.less";

type Props = {
    data: Trigger | null | undefined;
    triggerState: TriggerState | null | undefined;
    metrics?: MetricList;
    loading?: boolean;
    onRemoveMetric: (metricName: string) => void;
    onSetMetricMaintenance: (metricName: string, maintenance: number) => void;
    onSetTriggerMaintenance: (maintenance: number) => void;
    onThrottlingRemove: () => void;
};

export default class MobileTriggerInfoPage extends React.Component<Props> {
    render(): React.ReactElement {
        const {
            data: trigger,
            onSetMetricMaintenance,
            triggerState,
            loading,
            onRemoveMetric,
            onThrottlingRemove,
            onSetTriggerMaintenance,
            metrics,
        } = this.props;

        return (
            <div className={cn("root")}>
                <MobileTriggerInfo
                    data={trigger}
                    triggerState={triggerState}
                    onThrottlingRemove={onThrottlingRemove}
                    onSetMaintenance={onSetTriggerMaintenance}
                />
                <div className={cn("content")}>
                    {trigger == null && loading && <MobileEmptyContentLoading />}
                </div>
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
                                onSetMaintenance={onSetMetricMaintenance}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }

    renderMetricsStats(): React.ReactElement {
        const counts = this.getCountsByStatus();
        return (
            <span>
                Metrics:{" "}
                {Object.keys(Statuses)
                    .filter((x) => counts[x])
                    .map((status) => (
                        <span key={status} className={cn("metric-stats")}>
                            {status}:{" "}
                            <span
                                style={{ color: getStatusColor(status as Status) }}
                                className={cn("value")}
                            >
                                {counts[status]}
                            </span>
                        </span>
                    ))}
            </span>
        );
    }

    getCountsByStatus(): { [key: string]: number } {
        const { triggerState } = this.props;
        if (triggerState == null) {
            return {};
        }
        const metrics = triggerState.metrics || {};

        return Object.keys(metrics)
            .map((x) => metrics[x].state)
            .reduce((result: { [key: string]: number }, state: Status) => {
                result[state] = (result[state] || 0) + 1;
                return result;
            }, {});
    }
}
