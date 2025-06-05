import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    const { id: triggerId = "" } = useParams<{ id: string }>();
    const navigate = useNavigate();

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

    const handleDisableThrottling = async () => await deleteTriggerThrottling(triggerId);

    const handleSetTriggerMaintenance = async (maintenance: number) =>
        await setTriggerMaintenance({
            triggerId,
            maintenance,
            tagsToInvalidate: ["TriggerState", "TriggerList"],
        });

    const handleSetMetricMaintenance = async (metric: string, maintenance: number) =>
        await setMetricMaintenance({
            triggerId,
            metrics: { [metric]: maintenance },
            tagsToInvalidate: ["TriggerState", "TriggerList"],
        });

    const handleRemoveMetric = async (metric: string) =>
        await deleteMetric({ triggerId, metric, tagsToInvalidate: ["TriggerState"] });

    const handleRemoveNoDataMetric = async () => await deleteNoDataMetrics(triggerId);

    const handleDeleteTrigger = async () => {
        try {
            await deleteTrigger(triggerId).unwrap();
            navigate(getPageLink("index"));
        } catch {
            return;
        }
    };

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
