import React, { FC, useState } from "react";
import { Toggle } from "@skbkontur/react-ui/components/Toggle";
import ArrowChevronUpIcon from "@skbkontur/react-icons/ArrowChevronUp";
import ArrowChevronDownIcon from "@skbkontur/react-icons/ArrowChevronDown";
import AnimateHeight from "react-animate-height";
import MoiraServiceStates from "../../Domain/MoiraServiceStates";
import {
    useGetNotifierSourcesStateQuery,
    useSetNotifierSourceStateMutation,
} from "../../services/NotifierApi";
import useConfirmModal from "../../hooks/useConfirmModal";
import { ConfirmModalHeaderData } from "../../Domain/Global";

import styles from "./NotifierSourcesList.module.less";

export const NotifierSourcesList: FC = () => {
    const [expanded, setExpanded] = useState(false);
    const { data: notifierSourcesState } = useGetNotifierSourcesStateQuery();
    const [setNotifierSourceState] = useSetNotifierSourceStateMutation();

    const [ConfirmModal, setModalData] = useConfirmModal();

    const toggleNotifier = async (enable: boolean, triggerSource: string, clusterId: string) => {
        setModalData({ isOpen: false });
        const state = enable ? MoiraServiceStates.OK : MoiraServiceStates.ERROR;
        console.log({ state, triggerSource, clusterId });
        setNotifierSourceState({ state, triggerSource, clusterId });
    };

    const handleDisableNotifier = (triggerSource: string, clusterId: string) => {
        setModalData({
            isOpen: true,
            header: ConfirmModalHeaderData.moiraTurnOff,
            button: {
                text: "Turrn off",
                use: "danger",
                onConfirm: () => toggleNotifier(false, triggerSource, clusterId),
            },
        });
    };

    const toggleExpanded = () => setExpanded((prev) => !prev);

    return (
        <>
            {ConfirmModal}

            <div className={styles.expandableToggle} onClick={toggleExpanded}>
                {expanded ? <ArrowChevronUpIcon size={32} /> : <ArrowChevronDownIcon size={32} />}
                <div className={styles.bar} />
            </div>

            <AnimateHeight height={expanded ? "auto" : 0}>
                <div className={styles.sourcesGrid}>
                    {notifierSourcesState?.map((sourceState) => (
                        <Toggle
                            key={`${sourceState.trigger_source}.${sourceState.cluster_id}`}
                            checked={sourceState.state === MoiraServiceStates.OK}
                            onValueChange={(value) =>
                                value
                                    ? toggleNotifier(
                                          value,
                                          sourceState.trigger_source,
                                          sourceState.cluster_id
                                      )
                                    : handleDisableNotifier(
                                          sourceState.trigger_source,
                                          sourceState.cluster_id
                                      )
                            }
                        >
                            {`${sourceState.trigger_source} ${sourceState.cluster_id}`}
                        </Toggle>
                    ))}
                </div>
            </AnimateHeight>
        </>
    );
};
