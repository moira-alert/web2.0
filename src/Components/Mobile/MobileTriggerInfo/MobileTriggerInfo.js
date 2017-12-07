// @flow
import * as React from "react";
import moment from "moment";
import Sticky from "retail-ui/components/Sticky";
import Icon from "retail-ui/components/Icon";
import Spinner from "retail-ui/components/Spinner";

import type { Schedule } from "../../../Domain/Schedule";
import { getPageLink } from "../../../Domain/Global";
import type { Trigger, TriggerState } from "../../../Domain/Trigger";
import { Statuses } from "../../../Domain/Status";
import getStatusColor, { unknownColor } from "../Styles/StatusColor";

import MobileHeader from "../MobileHeader/MobileHeader";

import cn from "./MobileTriggerInfo.less";

type Props = {|
    data: ?Trigger,
    triggerState: ?TriggerState,
    loading: boolean,
    onThrottlingRemove: () => void,
|};

function ScheduleView(props: { data: Schedule }): React.Node {
    const { days, startOffset, endOffset } = props.data;
    const enabledDays = days.filter(({ enabled }) => enabled);
    const viewDays = days.length === enabledDays.length ? "Everyday" : enabledDays.map(({ name }) => name).join(", ");
    const viewTime =
        moment("1900-01-01 00:00:00")
            .add(startOffset, "minutes")
            .format("HH:mm") +
        " – " +
        moment("1900-01-01 00:00:00")
            .add(endOffset, "minutes")
            .format("HH:mm");
    return (
        <span>
            {viewDays} {viewTime}
        </span>
    );
}

export default class MobileTriggerInfo extends React.Component<Props> {
    props: Props;
    state = {
        showThrottling: false,
    };

    getWorstTriggerState(): ?Status {
        const { data: trigger, triggerState } = this.props;
        if (trigger == null || triggerState == null) {
            return null;
        }
        const metrics = triggerState.metrics || {};
        const metricStatuses = Object.keys(Statuses).filter(x =>
            Object.keys(metrics)
                .map(x => metrics[x].state)
                .includes(x)
        );
        const notOkStatuses = metricStatuses.filter(x => x !== Statuses.OK);
        if (triggerState.state === Statuses.EXCEPTION) {
            return Statuses.EXCEPTION;
        } else if (metricStatuses.length === 0) {
            return trigger.triggerStatus;
        } else if (notOkStatuses.length === 0) {
            return Statuses.OK;
        } else if (notOkStatuses.includes(Statuses.ERROR)) {
            return Statuses.ERROR;
        } else if (notOkStatuses.includes(Statuses.WARN)) {
            return Statuses.WARN;
        }
        return null;
    }

    getHeaderColor(): string {
        const state = this.getWorstTriggerState();
        if (state == null) {
            return unknownColor;
        }
        return getStatusColor(state);
    }

    handleDisableThrottling = () => {
        const { onThrottlingRemove } = this.props;
        this.setState({ showThrottling: true });
        onThrottlingRemove();
    };

    render(): React.Node {
        const { data: trigger, triggerState, loading } = this.props;
        const { showThrottling } = this.state;

        return (
            <MobileHeader color={this.getHeaderColor()}>
                <Sticky side="top">
                    <MobileHeader.HeaderBlock color={this.getHeaderColor()}>
                        <MobileHeader.LeftButton icon="ArrowChevronLeft" linkTo={getPageLink("index")} />
                        <MobileHeader.Title>{trigger != null ? trigger.name : "Loading trigger..."}</MobileHeader.Title>
                    </MobileHeader.HeaderBlock>
                </Sticky>
                <MobileHeader.DetailsBlock>
                    {trigger != null && (
                        <div className={cn("info")}>
                            <div className={cn("plain-row", "description")}>{trigger.desc && trigger.desc}</div>
                            <div className={cn("form-row")}>
                                <div className={cn("caption")}>Schedule:</div>
                                <div className={cn("value")}>
                                    <ScheduleView data={trigger.sched} />
                                </div>
                            </div>
                            <div className={cn("form-row")}>
                                <div className={cn("caption")}>Tags:</div>
                                <div className={cn("value")}>{trigger.tags.map(x => `#${x}`).join(", ")}</div>
                            </div>
                            {(trigger.throttling !== 0 || showThrottling) && (
                                <div className={cn("plain-row", "description")}>
                                    <Icon name="FlagSolid" />{" "}
                                    {trigger.throttling !== 0 ? "Throttling enabled." : "No Throttling."}{" "}
                                    <BorderlessButton
                                        onClick={this.handleDisableThrottling}
                                        disabled={trigger.throttling === 0}>
                                        Disable
                                    </BorderlessButton>
                                </div>
                            )}
                            {triggerState.msg != null &&
                                triggerState.msg !== "" && (
                                    <div className={cn("form-row")}>
                                        <div className={cn("caption")}>Exception:</div>
                                        <div className={cn("value")}>{triggerState.msg}</div>
                                    </div>
                                )}
                        </div>
                    )}
                </MobileHeader.DetailsBlock>
            </MobileHeader>
        );
    }
}

function BorderlessButton({ children, disabled, onClick }): React.Node {
    return (
        <div onClick={onClick} className={cn("borderless-button", { disabled: disabled })}>
            <span>{children}</span>
        </div>
    );
}
