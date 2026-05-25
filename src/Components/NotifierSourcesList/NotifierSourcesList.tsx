import { FC, useState } from "react";
import { SourcesGroup } from "./Components/SourcesGroup";
import { IconArrowCDownRegular32 } from "@skbkontur/icons/IconArrowCDownRegular32";
import { IconArrowCUpRegular32 } from "@skbkontur/icons/IconArrowCUpRegular32";
import AnimateHeight from "react-animate-height";
import MoiraServiceStates, { NotifierSourceState } from "../../Domain/MoiraServiceStates";
import { useSetNotifierSourceStateMutation } from "../../services/NotifierApi";
import useConfirmModal, { ConfirmModal } from "../../hooks/useConfirmModal";
import { ConfirmModalHeaderData } from "../../Domain/Global";
import { Flexbox } from "../Flexbox/FlexBox";

import styles from "./NotifierSourcesList.module.less";

interface INotifierSourcesListProps {
    graphiteGroup: NotifierSourceState[];
    prometheusGroup: NotifierSourceState[];
}

export const NotifierSourcesList: FC<INotifierSourcesListProps> = ({
    graphiteGroup,
    prometheusGroup,
}) => {
    const [expanded, setExpanded] = useState(false);
    const [setNotifierSourceState] = useSetNotifierSourceStateMutation();
    const { modalData, setModalData, closeModal } = useConfirmModal();

    const toggleExpanded = () => setExpanded((prev) => !prev);

    const toggleNotifier = async (enable: boolean, triggerSource: string, clusterId: string) => {
        setModalData({ isOpen: false });
        const state = enable ? MoiraServiceStates.OK : MoiraServiceStates.ERROR;
        setNotifierSourceState({ state, triggerSource, clusterId });
    };

    const handleDisableNotifier = (triggerSource: string, clusterId: string) => {
        setModalData({
            isOpen: true,
            header: ConfirmModalHeaderData.moiraSourceTurnOff(triggerSource, clusterId),
            button: {
                text: "Turn off",
                use: "danger",
                onConfirm: () => toggleNotifier(false, triggerSource, clusterId),
            },
        });
    };

    const isGraphiteGroupShown = graphiteGroup.length > 0;
    const isPrometheusGroupShown = prometheusGroup.length > 0;
    const shouldShowSourceGroups = isGraphiteGroupShown || isPrometheusGroupShown;

    return (
        <>
            {shouldShowSourceGroups && (
                <>
                    <ConfirmModal modalData={modalData} closeModal={closeModal} />
                    <Flexbox
                        className={styles.expandableToggle}
                        direction="row"
                        align="center"
                        gap={12}
                        onClick={toggleExpanded}
                    >
                        {expanded ? <IconArrowCUpRegular32 /> : <IconArrowCDownRegular32 />}
                        <div className={styles.bar} />
                    </Flexbox>
                    <AnimateHeight height={expanded ? "auto" : 0}>
                        <Flexbox gap={24}>
                            {isGraphiteGroupShown && (
                                <SourcesGroup
                                    title="Graphite"
                                    sources={graphiteGroup}
                                    onToggle={toggleNotifier}
                                    onDisableConfirm={handleDisableNotifier}
                                />
                            )}

                            {isPrometheusGroupShown && (
                                <SourcesGroup
                                    title="Prometheus"
                                    sources={prometheusGroup}
                                    onToggle={toggleNotifier}
                                    onDisableConfirm={handleDisableNotifier}
                                />
                            )}
                        </Flexbox>
                    </AnimateHeight>
                </>
            )}
        </>
    );
};
