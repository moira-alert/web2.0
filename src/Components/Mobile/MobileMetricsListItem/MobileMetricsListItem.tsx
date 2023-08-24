import * as React from "react";
import { format, fromUnixTime, getUnixTime } from "date-fns";
import UserSettingsIcon from "@skbkontur/react-icons/UserSettings";
import MenuDotsIcon from "@skbkontur/react-icons/MenuDots";
import TrashIcon from "@skbkontur/react-icons/Trash";
import RedoIcon from "@skbkontur/react-icons/Redo";
import { Modal } from "@skbkontur/react-ui/components/Modal";
import { Metric } from "../../../Domain/Metric";
import MobileStatusIndicator from "../MobileStatusIndicator/MobileStatusIndicator";
import { roundValue } from "../../../helpers/roundValue";
import {
    Maintenance,
    getMaintenanceCaption,
    calculateMaintenanceTime,
    MaintenanceList,
} from "../../../Domain/Maintenance";
import { getUTCDate } from "../../../helpers/DateUtil";
import cn from "./MobileMetricsListItem.less";

type Props = {
    style?: React.CSSProperties;
    name: string;
    value: Metric;
    onRemove: () => void;
    onSetMaintenance: (maintenance: number) => void;
    withTargets?: boolean;
};

type ButtonsState = "Default" | "SelectAction" | "SetMaintenance" | "DeleteConfirmation";

type State = {
    buttonsState: ButtonsState;
    deleted: boolean;
};

function isUnderkMaintenance(maintenance?: number | null): boolean {
    if (maintenance == null) {
        return false;
    }
    const delta = (maintenance || 0) - getUnixTime(getUTCDate());
    return delta > 0;
}

export default class MobileMetricsListItem extends React.Component<Props, State> {
    state: State = {
        buttonsState: "Default",
        deleted: false,
    };

    render(): React.ReactNode {
        const { name, value, style } = this.props;
        const { buttonsState, deleted } = this.state;

        return (
            <div className={cn("root", { deleted })} style={style}>
                <div className={cn("status")}>
                    {this.renderStatus()}
                    {isUnderkMaintenance(value.maintenance) && (
                        <div className={cn("maintenance-icon")}>
                            <UserSettingsIcon />
                        </div>
                    )}
                </div>
                <div className={cn("info")}>
                    <div className={cn("name")}>
                        {name != null && name !== "" ? name : "[No name]"}
                    </div>
                    {this.renderTargets()}
                </div>
                <div className={cn("buttons")}>
                    <div className={cn("button-block", { visible: buttonsState === "Default" })}>
                        <button
                            type="button"
                            className={cn("button")}
                            onClick={() => this.setState({ buttonsState: "SelectAction" })}
                        >
                            <MenuDotsIcon />
                        </button>
                    </div>
                    <div
                        className={cn("button-block", { visible: buttonsState === "SelectAction" })}
                    >
                        <button
                            type="button"
                            className={cn("button")}
                            onClick={() => this.setState({ buttonsState: "SetMaintenance" })}
                        >
                            <UserSettingsIcon />
                        </button>
                        <button
                            type="button"
                            onClick={this.handleDeleteMetric}
                            className={cn("button")}
                        >
                            <TrashIcon />
                        </button>
                        <button
                            type="button"
                            className={cn("button")}
                            onClick={() => this.setState({ buttonsState: "Default" })}
                        >
                            <RedoIcon />
                        </button>
                    </div>
                    {buttonsState === "SetMaintenance" && (
                        <Modal noClose onClose={() => this.setState({ buttonsState: "Default" })}>
                            <Modal.Body>
                                <div className={cn("modal-content")}>
                                    <div className={cn("modal-header")}>Maintenance metric</div>
                                    {MaintenanceList.map((maintenance: Maintenance) => (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                this.handleSetMaintenance(maintenance);
                                            }}
                                            className={cn("modal-button")}
                                            key={maintenance}
                                        >
                                            {getMaintenanceCaption(maintenance)}
                                        </button>
                                    ))}
                                </div>
                            </Modal.Body>
                        </Modal>
                    )}
                </div>
            </div>
        );
    }

    handleDeleteMetric = (): void => {
        const { onRemove } = this.props;
        this.setState({ deleted: true });
        onRemove();
    };

    handleSetMaintenance = (interval: Maintenance): void => {
        const { onSetMaintenance } = this.props;
        this.setState({ buttonsState: "Default" });
        onSetMaintenance(calculateMaintenanceTime(interval));
    };

    renderStatus(): React.ReactElement {
        const { value } = this.props;
        const { state } = value;
        return <MobileStatusIndicator statuses={[state]} size={30} />;
    }

    private renderTargets() {
        const values = this.props.value.values;
        const valuesKeys = values ? Object.keys(values) : null;
        const withTargets = this.props.withTargets;
        return (
            <div className={cn("tags")}>
                <div>
                    {valuesKeys
                        ? valuesKeys.map(function (key) {
                              const val = values ? values[key] : null;
                              return val ? (
                                  <div key={key}>
                                      {withTargets ? (
                                          <span className={cn("target-key")}>{key}: </span>
                                      ) : null}
                                      {roundValue(val)}{" "}
                                  </div>
                              ) : null;
                          })
                        : null}
                </div>
                <div className={cn("target-separator")}>@</div>
                <div>
                    {format(
                        fromUnixTime(this.props.value.event_timestamp || 0),
                        "MMMM d, HH:mm:ss"
                    )}
                </div>
            </div>
        );
    }
}
