import { FC } from "react";
import { DropdownMenu, MenuSeparator } from "@skbkontur/react-ui";
import { Checkbox } from "@skbkontur/react-ui/components/Checkbox";
import { Button } from "@skbkontur/react-ui/components/Button";
import { IconUiFilterFunnelRegular16 } from "@skbkontur/icons/IconUiFilterFunnelRegular16";
import { IconArrowCDownRegular16 } from "@skbkontur/icons/IconArrowCDownRegular16";

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
            caption={({ openMenu }: { openMenu: () => void }) => (
                <Button
                    width={width}
                    icon={
                        selectedClusterKeys.length ? (
                            <IconUiFilterFunnelRegular16 />
                        ) : (
                            <IconArrowCDownRegular16 />
                        )
                    }
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
