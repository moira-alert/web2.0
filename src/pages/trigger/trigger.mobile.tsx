import React, { ReactElement } from "react";
import type { Trigger, TriggerState } from "../../Domain/Trigger";
import MobileTriggerInfoPage from "../../Components/Mobile/MobileTriggerInfoPage/MobileTriggerInfoPage";

export type TriggerMobileProps = {
    trigger?: Trigger;
    state?: TriggerState;
    disableThrottling: () => void;
    setTriggerMaintenance: (maintenance: number) => void;
    setMetricMaintenance: (metric: string, maintenance: number) => void;
    removeMetric: (metric: string) => void;
};

export default function TriggerMobile({
    trigger,
    state,
    disableThrottling,
    setTriggerMaintenance,
    setMetricMaintenance,
    removeMetric,
}: TriggerMobileProps): ReactElement {
    const { metrics } = state || {};

    return (
        <MobileTriggerInfoPage
            data={trigger}
            triggerState={state}
            metrics={metrics}
            onRemoveMetric={removeMetric}
            onThrottlingRemove={disableThrottling}
            onSetMetricMaintenance={setMetricMaintenance}
            onSetTriggerMaintenance={setTriggerMaintenance}
        />
    );
}
