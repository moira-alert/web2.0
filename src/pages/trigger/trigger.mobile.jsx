// @flow
import * as React from "react";
import type { Trigger, TriggerState } from "../../Domain/Trigger";
import type { Maintenance } from "../../Domain/Maintenance";
import MobileTriggerInfoPage from "../../Components/Mobile/MobileTriggerInfoPage/MobileTriggerInfoPage";

type Props = {|
    trigger: ?Trigger,
    state: ?TriggerState,
    disableTrhrottling: (id: string) => void,
    setTriggerMaintenance: (id: string, maintenance: Maintenance) => void,
    setMetricMaintenance: (id: string, maintenance: Maintenance, metric: string) => void,
    removeMetric: (id: string, metric: string) => void,
|};

type State = {};

class TriggerMobile extends React.Component {
    state: State;

    props: Props;

    render() {
        const {
            trigger,
            state,
            disableTrhrottling,
            setTriggerMaintenance,
            setMetricMaintenance,
            removeMetric,
        } = this.props;
        const { metrics } = state || {};

        return (
            <MobileTriggerInfoPage
                data={trigger}
                triggerState={state}
                metrics={metrics}
                onRemoveMetric={metric => removeMetric(trigger.id, metric)}
                onThrottlingRemove={() => disableTrhrottling(trigger.id)}
                onSetMetricMaintenance={(metric, maintenance) =>
                    setMetricMaintenance(trigger.id, metric, maintenance)
                }
                onSetTriggerMaintenance={maintenance =>
                    setTriggerMaintenance(trigger.id, maintenance)
                }
            />
        );
    }
}

export { TriggerMobile as default };
