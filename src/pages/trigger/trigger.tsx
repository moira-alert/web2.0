import React, { useEffect, useCallback } from "react";
import { useParams, useHistory } from "react-router-dom";
import { TriggerDesktopProps } from "./trigger.desktop";
import { TriggerMobileProps } from "./trigger.mobile";
import { getPageLink } from "../../Domain/Global";
import { setDocumentTitle } from "../../helpers/setDocumentTitle";
import {
    useDeleteMetricMutation,
    useDeleteNoDataMetricMutation,
    useDeleteTriggerMutation,
    useDeleteTriggerThrottlingMutation,
    useGetTriggerQuery,
    useGetTriggerStateQuery,
    useSetMetricsMaintenanceMutation,
    useSetTriggerMaintenanceMutation,
} from "../../services/TriggerApi";
import { useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";

export type TriggerProps = {
    view: React.ComponentType<TriggerDesktopProps | TriggerMobileProps>;
};

const TriggerPage: React.FC<TriggerProps> = ({ view: TriggerView }) => {
    const { id: triggerId } = useParams<{ id: string }>();
    const history = useHistory();

    const { data: trigger } = useGetTriggerQuery(
        {
            triggerId,
            populated: true,
        },
        { refetchOnMountOrArgChange: true }
    );
    const { data: triggerState } = useGetTriggerStateQuery(triggerId);
    const [deleteTriggerThrottling] = useDeleteTriggerThrottlingMutation();
    const [setTriggerMaintenance] = useSetTriggerMaintenanceMutation();
    const [setMetricMaintenance] = useSetMetricsMaintenanceMutation();
    const [deleteMetric] = useDeleteMetricMutation();
    const [deleteNoDataMetrics] = useDeleteNoDataMetricMutation();
    const [deleteTrigger] = useDeleteTriggerMutation();
    const { error, isLoading } = useAppSelector(UIState);

    const handleDisableThrottling = useCallback(
        async () => await deleteTriggerThrottling(triggerId),
        []
    );

    const handleSetTriggerMaintenance = useCallback(
        async (maintenance: number) => await setTriggerMaintenance({ triggerId, maintenance }),
        []
    );

    const handleSetMetricMaintenance = useCallback(
        async (metric: string, maintenance: number) =>
            await setMetricMaintenance({ triggerId, metrics: { [metric]: maintenance } }),
        []
    );

    const handleRemoveMetric = useCallback(async (metric: string) => {
        await deleteMetric({ triggerId, metric });
    }, []);

    const handleRemoveNoDataMetric = useCallback(async () => {
        await deleteNoDataMetrics(triggerId);
    }, []);

    const handleDeleteTrigger = useCallback(async () => {
        await deleteTrigger(triggerId);
        history.push(getPageLink("index"));
    }, []);

    useEffect(() => {
        setDocumentTitle("Trigger");
    }, []);

    return (
        <TriggerView
            trigger={trigger}
            state={triggerState}
            loading={isLoading}
            error={error}
            deleteTrigger={handleDeleteTrigger}
            disableThrottling={handleDisableThrottling}
            setTriggerMaintenance={handleSetTriggerMaintenance}
            setMetricMaintenance={handleSetMetricMaintenance}
            removeMetric={handleRemoveMetric}
            removeNoDataMetric={handleRemoveNoDataMetric}
        />
    );
};

export default TriggerPage;
