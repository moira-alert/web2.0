import React, { FC } from "react";
import { Toggle } from "@skbkontur/react-ui/components/Toggle";
import MoiraServiceStates, { NotifierSourceState } from "../../../Domain/MoiraServiceStates";

import styles from "./SourcesGroup.module.less";

interface IGroupProps {
    title: string;
    sources: NotifierSourceState[];
    onToggle: (enable: boolean, triggerSource: string, clusterId: string) => void;
    onDisableConfirm: (triggerSource: string, clusterId: string) => void;
}

export const SourcesGroup: FC<IGroupProps> = ({ title, sources, onToggle, onDisableConfirm }) => {
    const handleValueChange = (
        value: boolean,
        trigger_source: string,
        cluster_id: string
    ): void => {
        value
            ? onToggle(value, trigger_source, cluster_id)
            : onDisableConfirm(trigger_source, cluster_id);
    };

    return (
        <>
            <div className={styles.groupTitle}>{title}</div>
            <div className={styles.sourcesGrid}>
                {sources.map(({ trigger_source, cluster_id, state }) => (
                    <Toggle
                        key={`${trigger_source}.${cluster_id}`}
                        checked={state === MoiraServiceStates.OK}
                        onValueChange={(value) =>
                            handleValueChange(value, trigger_source, cluster_id)
                        }
                    >
                        {`${trigger_source} ${cluster_id}`}
                    </Toggle>
                ))}
            </div>
        </>
    );
};
