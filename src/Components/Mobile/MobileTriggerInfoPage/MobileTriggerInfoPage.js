// @flow
import * as React from "react";
import Sticky from "retail-ui/components/Sticky";

import type { Metric } from "../../../Domain/Metric";
import type { Status } from "../../../Domain/Status";
import type { Trigger, TriggerState } from "../../../Domain/Trigger";
import type { Maintenance } from "../../../Domain/Maintenance";
import { Statuses } from "../../../Domain/Status";
import getStatusColor from "../Styles/StatusColor";

import MobileEmptyContentLoading from "../MobileEmptyContentLoading/MobileEmptyContentLoading";
import MobileMetricsList from "../MobileMetricsList/MobileMetricsList";
import MobileTriggerInfo from "../MobileTriggerInfo/MobileTriggerInfo";

import cn from "./MobileTriggerInfoPage.less";

type Props = {|
    data: ?Trigger,
    triggerState: ?TriggerState,
    metrics: ?{ [metric: string]: Metric },
    loading?: boolean,
    onRemoveMetric: (metricName: string) => void,
    onSetMaintenance: (metricName: string, maintenancesInterval: Maintenance) => void,
    onThrottlingRemove: () => void,
|};

export default class MobileTriggerInfoPage extends React.Component<Props> {
    props: Props;

    getCountsByStatus(): { [key: Status]: number } {
        const { triggerState } = this.props;
        if (triggerState == null) {
            return {};
        }
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
