import React, { FC, useState, useMemo } from "react";
import { SourcesGroup } from "./Components/SourcesGroup";
import ArrowChevronUpIcon from "@skbkontur/react-icons/ArrowChevronUp";
import ArrowChevronDownIcon from "@skbkontur/react-icons/ArrowChevronDown";
import AnimateHeight from "react-animate-height";
import MoiraServiceStates, { NotifierSourceState } from "../../Domain/MoiraServiceStates";
import {
    useGetNotifierSourcesStateQuery,
    useSetNotifierSourceStateMutation,
} from "../../services/NotifierApi";
import useConfirmModal from "../../hooks/useConfirmModal";
import { ConfirmModalHeaderData } from "../../Domain/Global";
import { Flexbox } from "../Flexbox/FlexBox";

import styles from "./NotifierSourcesList.module.less";

const filterAndSortSources = (
    sources: NotifierSourceState[] | undefined,
    keyword: string
): NotifierSourceState[] => {
    if (!sources) return [];
    return sources
        .filter((s) => s.trigger_source.toLowerCase().includes(keyword.toLowerCase()))
        .sort((a, b) =>
            a.cluster_id.localeCompare(b.cluster_id, undefined, {
                numeric: true,
                sensitivity: "base",
            })
        );
};

export const NotifierSourcesList: FC = () => {
    const [expanded, setExpanded] = useState(false);
    const { data: notifierSourcesState } = useGetNotifierSourcesStateQuery();
    const [setNotifierSourceState] = useSetNotifierSourceStateMutation();
    const [ConfirmModal, setModalData] = useConfirmModal();

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

    const { graphiteGroup, prometheusGroup } = useMemo(() => {
        return {
            graphiteGroup: filterAndSortSources(notifierSourcesState, "graphite"),
            prometheusGroup: filterAndSortSources(notifierSourcesState, "prometheus"),
        };
    }, [notifierSourcesState]);

    const isGraphiteGroupShown = graphiteGroup.length > 0;
    const isPrometheusGroupShown = prometheusGroup.length > 0;
    const shouldShowSourceGroups = isGraphiteGroupShown || isPrometheusGroupShown;

    return (
        <>
            {shouldShowSourceGroups && (
                <>
                    {ConfirmModal}
                    <Flexbox
                        className={styles.expandableToggle}
                        direction="row"
                        align="center"
                        gap={12}
                        onClick={toggleExpanded}
                    >
                        {expanded ? (
                            <ArrowChevronUpIcon size={32} />
                        ) : (
                            <ArrowChevronDownIcon size={32} />
                        )}
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
