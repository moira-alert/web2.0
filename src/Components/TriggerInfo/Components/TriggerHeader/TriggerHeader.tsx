import { FC, ReactNode } from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Tooltip } from "@skbkontur/react-ui/components/Tooltip";
import { DropdownMenu, MenuSeparator } from "@skbkontur/react-ui";
import { MenuItem } from "@skbkontur/react-ui/components/MenuItem";
import { IconArrowShapeTriangleADownSolid16 } from "@skbkontur/icons/IconArrowShapeTriangleADownSolid16";
import { IconToolPencilLineRegular16 } from "@skbkontur/icons/IconToolPencilLineRegular16";
import { IconTimeClockRegular16 } from "@skbkontur/icons/IconTimeClockRegular16";
import { IconXCircleRegular16 } from "@skbkontur/icons/IconXCircleRegular16";
import { IconArrowUiShareAExportRegular16 } from "@skbkontur/icons/IconArrowUiShareAExportRegular16";
import { IconCopyRegular16 } from "@skbkontur/icons/IconCopyRegular16";
import { IconDataChartBarsARegular16 } from "@skbkontur/icons/IconDataChartBarsARegular16";
import { IconTrashCanRegular16 } from "@skbkontur/icons/IconTrashCanRegular16";
import RouterLink from "../../../RouterLink/RouterLink";
import MaintenanceSelect from "../../../MaintenanceSelect/MaintenanceSelect";
import FileExport from "../../../FileExport/FileExport";
import { Trigger, TriggerState, maintenanceDelta } from "../../../../Domain/Trigger";
import { getPageLink } from "../../../../Domain/Global";
import { omitTrigger } from "../../../../helpers/omitTypes";
import { humanizeDuration } from "../../../../helpers/DateUtil";
import { format, fromUnixTime } from "date-fns";
import { MetricsPlotModal } from "../../../MetricsPlotModal/MetricsPlotModal";
import { useModal } from "../../../../hooks/useModal";

import styles from "./TriggerHeader.module.less";

interface TriggerHeaderProps {
    trigger: Trigger;
    triggerState: TriggerState;
    metricsTtl?: number;
    onSetMaintenance: (maintenance: number) => void;
    onThrottlingRemove: () => void;
    onDeleteClick: () => void;
}

export const TriggerHeader: FC<TriggerHeaderProps> = ({
    trigger,
    triggerState,
    metricsTtl,
    onSetMaintenance,
    onThrottlingRemove,
    onDeleteClick,
}) => {
    const { id, name, throttling } = trigger;
    const { maintenance, maintenance_info } = triggerState;
    const delta = maintenanceDelta(maintenance);

    const { isModalOpen, openModal, closeModal } = useModal();

    return (
        <header className={styles.header}>
            <h1 className={styles.title} data-tid="Name">
                {name != null && name !== "" ? name : "[No name]"}
            </h1>
            <div className={styles.controls}>
                <RouterLink
                    data-tid="Edit"
                    to={getPageLink("triggerEdit", id)}
                    icon={<IconToolPencilLineRegular16 />}
                    className={styles.editLink}
                >
                    Edit
                </RouterLink>
                <Tooltip
                    render={() => {
                        if (
                            !(
                                delta > 0 &&
                                maintenance_info?.setup_user &&
                                maintenance_info?.setup_time
                            )
                        )
                            return null;
                        return (
                            <div>
                                Maintenance was set
                                <br />
                                by {maintenance_info.setup_user}
                                <br />
                                at{" "}
                                {format(
                                    fromUnixTime(maintenance_info.setup_time),
                                    "MMMM d, HH:mm:ss"
                                )}
                            </div>
                        );
                    }}
                >
                    <MaintenanceSelect
                        icon={<IconTimeClockRegular16 />}
                        maintenance={maintenance}
                        caption={maintenanceCaption(delta)}
                        onSetMaintenance={onSetMaintenance}
                    />
                </Tooltip>
                <DropdownMenu
                    caption={
                        <Button rightIcon={<IconArrowShapeTriangleADownSolid16 />} use="text">
                            Other
                        </Button>
                    }
                >
                    {throttling !== 0 && (
                        <MenuItem onClick={onThrottlingRemove} icon={<IconXCircleRegular16 />}>
                            Disable throttling
                        </MenuItem>
                    )}
                    <MenuItem icon={<IconArrowUiShareAExportRegular16 />}>
                        <FileExport data={omitTrigger(trigger)} title={`trigger ${name || id}`} />
                    </MenuItem>
                    <MenuItem
                        target="_blank"
                        icon={<IconCopyRegular16 />}
                        href={getPageLink("triggerDuplicate", id)}
                    >
                        Duplicate
                    </MenuItem>
                    <MenuItem onClick={openModal} icon={<IconDataChartBarsARegular16 />}>
                        Metrics graph
                    </MenuItem>
                    <MenuSeparator />
                    <MenuItem icon={<IconTrashCanRegular16 />} onClick={onDeleteClick}>
                        Delete
                    </MenuItem>
                </DropdownMenu>
            </div>
            {metricsTtl && isModalOpen && (
                <MetricsPlotModal
                    closeModal={closeModal}
                    metricsTtl={metricsTtl}
                    targets={trigger.targets}
                    triggerId={id}
                />
            )}
        </header>
    );
};

function maintenanceCaption(delta: number): ReactNode {
    return <span>{delta <= 0 ? "Maintenance" : humanizeDuration(delta)}</span>;
}
