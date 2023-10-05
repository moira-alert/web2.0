import * as React from "react";
import { Sticky } from "@skbkontur/react-ui/components/Sticky";
import { MetricItemList } from "../../../Domain/Metric";
import { StatusesList } from "../../../Domain/Status";
import { Trigger, TriggerState } from "../../../Domain/Trigger";
import { Status } from "../../../Domain/Status";
import getStatusColor from "../Styles/StatusColor";
import MobileEmptyContentLoading from "../MobileEmptyContentLoading/MobileEmptyContentLoading";
import MobileMetricsList from "../MobileMetricsList/MobileMetricsList";
import MobileTriggerInfo from "../MobileTriggerInfo/MobileTriggerInfo";
import classNames from "classnames/bind";

import styles from "./MobileTriggerInfoPage.less";

const cn = classNames.bind(styles);

type Props = {
    data?: Trigger | null;
    triggerState?: TriggerState | null;
    metrics?: MetricItemList;
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
                    {metrics != null && (
                        <MobileMetricsList
                            withTargets={trigger?.targets && trigger.targets.length > 1}
                            metrics={metrics}
                            onRemove={onRemoveMetric}
                            onSetMaintenance={onSetMetricMaintenance}
                        />
                    )}
                </div>
            </div>
        );
    }

    renderMetricsStats(): React.ReactElement {
        const counts = this.getCountsByStatus();
        return (
            <span>
                Metrics:{" "}
                {StatusesList.filter((x) => counts[x]).map((status) => (
                    <span key={status} className={cn("metric-stats")}>
                        {status}:{" "}
                        <span style={{ color: getStatusColor(status) }} className={cn("value")}>
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
