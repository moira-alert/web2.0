import React from "react";
import { Trigger, TriggerState } from "../../Domain/Trigger";
import { Layout, LayoutPlate, LayoutContent } from "../../Components/Layout/Layout";
import TriggerInfo from "../../Components/TriggerInfo/TriggerInfo";
import { TriggerInfoTabs } from "../../Components/TriggerInfo/Components/TriggerInfoTabs";

export type TriggerDesktopProps = {
    trigger?: Trigger;
    state?: TriggerState;
    deleteTrigger: () => void;
    disableThrottling: () => void;
    setTriggerMaintenance: (maintenance: number) => void;
    setMetricMaintenance: (metric: string, maintenance: number) => void;
    removeMetric: (metric: string) => void;
    removeNoDataMetric: () => void;
    loading: boolean;
    error?: string | null;
};

const TriggerDesktop: React.FC<TriggerDesktopProps> = ({
    trigger,
    state,
    deleteTrigger,
    disableThrottling,
    setTriggerMaintenance,
    setMetricMaintenance,
    removeMetric,
    removeNoDataMetric,
    loading,
    error,
}) => {
    const metrics = state?.metrics || {};

    return (
        <Layout loading={loading} error={error}>
            {trigger && state && (
                <>
                    <LayoutPlate>
                        <TriggerInfo
                            trigger={trigger}
                            triggerState={state}
                            onThrottlingRemove={disableThrottling}
                            onSetMaintenance={(maintenance) => setTriggerMaintenance(maintenance)}
                            metrics={metrics}
                            deleteTrigger={deleteTrigger}
                        />
                    </LayoutPlate>
                    <LayoutContent>
                        <TriggerInfoTabs
                            metrics={metrics}
                            removeMetric={removeMetric}
                            setMetricMaintenance={setMetricMaintenance}
                            removeNoDataMetric={removeNoDataMetric}
                        />
                    </LayoutContent>
                </>
            )}
        </Layout>
    );
};

export default TriggerDesktop;
