import type { ReactElement } from "react";
import { Trigger, TriggerState } from "../../Domain/Trigger";
import { ConfirmModalHeaderData } from "../../Domain/Global";
import { MetricStateChart } from "../MetricStateChart/MetricStateChart";
import { MetricItemList } from "../../Domain/Metric";
import useConfirmModal, { ConfirmModal } from "../../hooks/useConfirmModal";
import { TriggerHeader } from "./Components/TriggerHeader/TriggerHeader";
import { TriggerDetails } from "./Components/TriggerDetails/TriggerDetails";
import { useClusterName } from "./hooks/useClusterName";
import { useOwnerTeam } from "./hooks/useOwnerTeam";

import styles from "./TriggerInfo.module.less";

interface IProps {
    trigger: Trigger;
    triggerState: TriggerState;
    supportEmail?: string;
    metrics?: MetricItemList;
    deleteTrigger: () => void;
    onThrottlingRemove: () => void;
    onSetMaintenance: (maintenance: number) => void;
}

export default function TriggerInfo({
    trigger,
    triggerState,
    supportEmail,
    metrics,
    deleteTrigger,
    onThrottlingRemove,
    onSetMaintenance,
}: IProps): ReactElement {
    const { team_id } = trigger;

    const {
        modalData: confirmModalData,
        setModalData: setConfirmModalData,
        closeModal: closeConfirmModal,
    } = useConfirmModal();

    const { clusterName, metricsTtl, availableClustersCount } = useClusterName(trigger);
    const { ownerTeam, isShown: isOwnerTeamShown } = useOwnerTeam(team_id);

    const isClusterName = !!(clusterName && availableClustersCount !== 0);
    const isMetrics = metrics && Object.keys(metrics).length > 1;

    const onDeleteTrigger = () => {
        setConfirmModalData({ isOpen: false });
        deleteTrigger();
    };

    const handleDeleteTrigger = () => {
        setConfirmModalData({
            isOpen: true,
            header: ConfirmModalHeaderData.deleteTrigger,
            body: (
                <>
                    Trigger <strong>{trigger.name}</strong> will be deleted.
                </>
            ),
            button: {
                text: "Delete",
                use: "danger",
                onConfirm: onDeleteTrigger,
            },
        });
    };

    return (
        <section>
            <TriggerHeader
                metricsTtl={metricsTtl}
                trigger={trigger}
                triggerState={triggerState}
                onSetMaintenance={onSetMaintenance}
                onThrottlingRemove={onThrottlingRemove}
                onDeleteClick={handleDeleteTrigger}
            />

            <div className={styles["info-section"]}>
                <TriggerDetails
                    trigger={trigger}
                    triggerState={triggerState}
                    supportEmail={supportEmail}
                    clusterName={clusterName}
                    ownerTeam={ownerTeam}
                    isOwnerTeamShown={isOwnerTeamShown}
                    isClusterName={isClusterName}
                />

                {isMetrics && (
                    <div className={styles["state-chart"]}>
                        <MetricStateChart
                            displayLegend
                            enableTooltip
                            height={"10rem"}
                            width={"18rem"}
                            metrics={metrics}
                        />
                    </div>
                )}
            </div>

            <ConfirmModal modalData={confirmModalData} closeModal={closeConfirmModal} />
        </section>
    );
}
