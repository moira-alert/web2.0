import React, { useState, useRef } from "react";
import ArrowTriangleDownIcon from "@skbkontur/react-icons/ArrowTriangleDown";
import { RenderLayer } from "@skbkontur/react-ui/internal/RenderLayer";
import { DropdownContainer } from "@skbkontur/react-ui/internal/DropdownContainer";
import { Button } from "@skbkontur/react-ui/components/Button/Button";
import { MenuItem } from "@skbkontur/react-ui/components/MenuItem";
import { Menu } from "@skbkontur/react-ui/internal/Menu";
import {
    calculateMaintenanceTime,
    getMaintenanceCaption,
    MaintenanceList,
} from "../../Domain/Maintenance";
import CustomMaintenanceMenu from "./CustomMaintenanceMenu/CustomMaintenanceMenu";
import cn from "./MaintenanceSelect.less";

type MaintenanceSelectProps = {
    caption: React.ReactNode;
    maintenance?: number;
    onSetMaintenance: (maintenance: number) => void;
};

export default function MaintenanceSelect(props: MaintenanceSelectProps): React.ReactElement {
    const { caption, maintenance, onSetMaintenance } = props;
    const [opened, setOpened] = useState(false);
    const [customMenuShow, setCustomMenuShow] = useState(false);
    const containerEl = useRef(null);
    const handleClose = () => {
        setOpened(false);
        setCustomMenuShow(false);
    };
    const handleSetMaintenance = (changedMaintenance: number) => {
        handleClose();
        onSetMaintenance(changedMaintenance);
    };

    return (
        <RenderLayer onClickOutside={handleClose} onFocusOutside={handleClose} active={opened}>
            <span ref={containerEl} className={cn("container")}>
                <Button onClick={() => setOpened(true)} use="link">
                    {caption} <ArrowTriangleDownIcon color="#6b99d3" />
                </Button>
                {opened ? (
                    <DropdownContainer getParent={() => containerEl.current} align="right">
                        {customMenuShow ? (
                            <CustomMaintenanceMenu
                                maintenance={maintenance}
                                setMaintenance={handleSetMaintenance}
                            />
                        ) : (
                            <Menu maxHeight={600}>
                                {MaintenanceList.map((maintenance) => (
                                    <MenuItem
                                        key={maintenance}
                                        onClick={() =>
                                            handleSetMaintenance(
                                                calculateMaintenanceTime(maintenance)
                                            )
                                        }
                                    >
                                        {getMaintenanceCaption(maintenance)}
                                    </MenuItem>
                                ))}
                                <MenuItem onClick={() => setCustomMenuShow(true)}>Custom</MenuItem>
                            </Menu>
                        )}
                    </DropdownContainer>
                ) : null}
            </span>
        </RenderLayer>
    );
}
