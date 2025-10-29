import React, { FC } from "react";
import { DropdownMenu, MenuSeparator } from "@skbkontur/react-ui";
import { Checkbox } from "@skbkontur/react-ui/components/Checkbox";
import { Button } from "@skbkontur/react-ui/components/Button";
import Filter from "@skbkontur/react-icons/Filter";
import ArrowChevronDown from "@skbkontur/react-icons/ArrowChevronDown";

import styles from "~styles/utils.module.less";

interface IClusterKeyDropdownSelectProps {
    clusterKeys?: string[];
    selectedClusterKeys: string[];
    onToggleCluster: (clusterKey: string, checked: boolean) => void;
    onToggleAll: (checked: boolean) => void;
    width?: number;
}

export const ClusterKeyDropdownSelect: FC<IClusterKeyDropdownSelectProps> = ({
    clusterKeys,
    selectedClusterKeys,
    onToggleCluster,
    onToggleAll,
    width = 180,
}) => {
    return (
        <DropdownMenu
            menuMaxHeight={300}
            caption={({ openMenu }: { openMenu: () => void }) => (
                <Button
                    width={width}
                    icon={selectedClusterKeys.length ? <Filter /> : <ArrowChevronDown />}
                    use="default"
                    onClick={openMenu}
                >
                    Cluster key
                </Button>
            )}
        >
            <div className={styles["dropdown-checkbox-item"]}>
                <Checkbox
                    className={styles["dropdown-checkbox"]}
                    checked={selectedClusterKeys.length === 0}
                    onValueChange={onToggleAll}
                >
                    All
                </Checkbox>
            </div>
            <MenuSeparator />
            {clusterKeys?.map((clusterKey) => (
                <div key={clusterKey} className={styles["dropdown-checkbox-item"]}>
                    <Checkbox
                        className={styles["dropdown-checkbox"]}
                        checked={selectedClusterKeys.includes(clusterKey)}
                        onValueChange={(value) => onToggleCluster(clusterKey, value)}
                    >
                        {clusterKey}
                    </Checkbox>
                </div>
            ))}
        </DropdownMenu>
    );
};
