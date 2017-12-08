// @flow
import * as React from "react";
import moment from "moment";
import Icon from "retail-ui/components/Icon";
import Modal from "retail-ui/components/Modal";

import type { Metric } from "../../../Domain/Metric";
import MobileStatusIndicator from "../MobileStatusIndicator/MobileStatusIndicator";
import { roundValue } from "../../../helpers";

import cn from "./MobileMetricsListItem.less";
import { Maintenances, type Maintenance } from "./../../../Domain/Maintenance";

type Props = {|
    name: string,
    value: Metric,
    onRemove: () => void,
    onSetMaintenance: (maintenancesInterval: Maintenance) => void,
|};

type ButtonsState = "Default" | "SelectAction" | "SetMaintenance" | "DeleteConfirmation";

type State = {|
    buttonsState: ButtonsState,
    deleted: boolean,
|};

function isUnderkMaintenance(maintenance: ?number): boolean {
    if (maintenance == null) {
        return false;
    }
    const delta = (maintenance || 0) - moment.utc().unix();
    return delta > 0;
}

export default class MobileMetricsListItem extends React.Component<Props, State> {
    props: Props;
    state: State = {
        buttonsState: "Default",
        deleted: false,
    };

    renderStatus(): React.Node {
        const { state } = this.props.value;
        return <MobileStatusIndicator statuses={[state]} size={30} />;
    }

    handleDeleteMetric = () => {
        const { onRemove } = this.props;
        this.setState({ deleted: true });
        onRemove();
    };

    handleSetMaintenance = (interval: Maintenance) => {
        const { onSetMaintenance } = this.props;
        this.setState({ buttonsState: "Default" });
        onSetMaintenance(interval);
    };

    render(): React.Node {
        const { name, value } = this.props;
        const { buttonsState } = this.state;

        return (
            <div className={cn("root", { deleted: this.state.deleted })}>
                <div className={cn("status")}>
                    {this.renderStatus()}
                    {isUnderkMaintenance(value.maintenance) && (
                        <div className={cn("maintenance-icon")}>
                            <Icon name="UserSettings" />
                        </div>
                    )}
                </div>
                <div className={cn("info")}>
                    <div className={cn("name")}>{name != null && name !== "" ? name : "[No name]"}</div>
                    <div className={cn("tags")}>
                        {roundValue(value.value)}
                        {" @ "}
                        {moment.unix(value.event_timestamp || 0).format("MMMM D, HH:mm:ss")}
                    </div>
                </div>
                <div className={cn("buttons")}>
                    <div className={cn("button-block", { visible: buttonsState === "Default" })}>
                        <div className={cn("button")} onClick={() => this.setState({ buttonsState: "SelectAction" })}>
                            <Icon name="MenuDots" />
                        </div>
                    </div>
                    <div className={cn("button-block", { visible: buttonsState === "SelectAction" })}>
                        <div className={cn("button")} onClick={() => this.setState({ buttonsState: "SetMaintenance" })}>
                            <Icon name="UserSettings" />
                        </div>
                        <div onClick={this.handleDeleteMetric} className={cn("button")}>
                            <Icon name="Trash" />
                        </div>
                        <div className={cn("button")} onClick={() => this.setState({ buttonsState: "Default" })}>
                            <Icon name="Redo" />
                        </div>
                    </div>
                    {buttonsState === "SetMaintenance" && (
                        <Modal noClose onClose={() => this.setState({ buttonsState: "Default" })}>
                            <Modal.Body>
                                <div className={cn("modal-content")}>
                                    <div className={cn("modal-header")}>Maintenance</div>
                                    <div
                                        onClick={() => this.handleSetMaintenance(Maintenances.off)}
                                        className={cn("modal-button")}>
                                        OFF
                                    </div>
                                    <div
                                        onClick={() => this.handleSetMaintenance(Maintenances.quarterHour)}
                                        className={cn("modal-button")}>
                                        15 MIN
                                    </div>
                                    <div
                                        onClick={() => this.handleSetMaintenance(Maintenances.oneHour)}
                                        className={cn("modal-button")}>
                                        1 HOUR
                                    </div>
                                    <div
                                        onClick={() => this.handleSetMaintenance(Maintenances.threeHours)}
                                        className={cn("modal-button")}>
                                        3 HOURS
                                    </div>
                                    <div
                                        onClick={() => this.handleSetMaintenance(Maintenances.sixHours)}
                                        className={cn("modal-button")}>
                                        6 HOURS
                                    </div>
                                    <div
                                        onClick={() => this.handleSetMaintenance(Maintenances.oneDay)}
                                        className={cn("modal-button")}>
                                        1 DAY
                                    </div>
                                    <div
                                        onClick={() => this.handleSetMaintenance(Maintenances.oneWeek)}
                                        className={cn("modal-button")}>
                                        1 WEEK
                                    </div>
                                </div>
                            </Modal.Body>
                        </Modal>
                    )}
                </div>
            </div>
        );
    }
}
