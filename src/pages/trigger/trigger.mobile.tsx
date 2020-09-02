import React, { ReactElement } from "react";
import type { Trigger, TriggerState } from "../../Domain/Trigger";
import MobileTriggerInfoPage from "../../Components/Mobile/MobileTriggerInfoPage/MobileTriggerInfoPage";

export type TriggerMobileProps = {
    trigger?: Trigger;
    state?: TriggerState;
    disableThrottling: (id: string) => void;
    setTriggerMaintenance: (id: string, maintenance: number) => void;
    setMetricMaintenance: (id: string, metric: string, maintenance: number) => void;
    removeMetric: (id: string, metric: string) => void;
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
            onRemoveMetric={(metric) => removeMetric(trigger ? trigger.id : "", metric)}
            onThrottlingRemove={() => disableThrottling(trigger ? trigger.id : "")}
            onSetMetricMaintenance={(metric, maintenance) =>
                setMetricMaintenance(trigger ? trigger.id : "", metric, maintenance)
            }
            onSetTriggerMaintenance={(maintenance) =>
                setTriggerMaintenance(trigger ? trigger.id : "", maintenance)
            }
        />
    );
}
