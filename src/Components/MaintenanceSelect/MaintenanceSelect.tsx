import React, { useState, useRef } from "react";
import ArrowTriangleDownIcon from "@skbkontur/react-icons/ArrowTriangleDown";
import { RenderLayer } from "@skbkontur/react-ui/internal/RenderLayer";
import { Popup } from "@skbkontur/react-ui/internal/Popup";
import { Button } from "@skbkontur/react-ui/components/Button/Button";
import { MenuItem } from "@skbkontur/react-ui/components/MenuItem";
import { Menu } from "@skbkontur/react-ui/internal/Menu";
import {
    calculateMaintenanceTime,
    getMaintenanceCaption,
    MaintenanceList,
} from "../../Domain/Maintenance";
import CustomMaintenanceMenu from "./CustomMaintenanceMenu/CustomMaintenanceMenu";
import { addMonths, lastDayOfMonth } from "date-fns";
import classNames from "classnames/bind";

import styles from "./MaintenanceSelect.less";

const cn = classNames.bind(styles);

type MaintenanceSelectProps = {
    caption: React.ReactNode;
    maintenance?: number;
    onSetMaintenance: (maintenance: number) => void;
    icon?: React.ReactElement;
};

export default function MaintenanceSelect({
    caption,
    maintenance,
    onSetMaintenance,
    icon,
}: MaintenanceSelectProps): React.ReactElement {
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
                <Button
                    data-tid="TriggerMaintenanceButton"
                    onClick={() => setOpened(true)}
                    use="link"
                    rightIcon={<ArrowTriangleDownIcon />}
                    icon={icon}
                >
                    {caption}
                </Button>
                {opened && (
                    <Popup hasShadow anchorElement={containerEl.current} opened={true}>
                        {customMenuShow ? (
                            <CustomMaintenanceMenu
                                maxDate={lastDayOfMonth(addMonths(new Date(), 1))}
                                minDate={new Date()}
                                maintenance={maintenance}
                                setMaintenance={handleSetMaintenance}
                            />
                        ) : (
                            <Menu hasMargin={false} maxHeight={600}>
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
                    </Popup>
                )}
            </span>
        </RenderLayer>
    );
}
