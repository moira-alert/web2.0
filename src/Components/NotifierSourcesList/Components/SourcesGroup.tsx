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

export const SourcesGroup: FC<IGroupProps> = ({ title, sources, onToggle, onDisableConfirm }) => (
    <>
        <div className={styles.groupTitle}>{title}</div>
        <div className={styles.sourcesGrid}>
            {sources.map(({ trigger_source, cluster_id, state }) => (
                <Toggle
                    key={`${trigger_source}.${cluster_id}`}
                    checked={state === MoiraServiceStates.OK}
                    onValueChange={(value) =>
                        value
                            ? onToggle(value, trigger_source, cluster_id)
                            : onDisableConfirm(trigger_source, cluster_id)
                    }
                >
                    {`${trigger_source} ${cluster_id}`}
                </Toggle>
            ))}
        </div>
    </>
);
