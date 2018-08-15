// @flow
import * as React from "react";
import Radio from "retail-ui/components/Radio";
import { ValidationWrapperV1, tooltip, type ValidationInfo } from "react-ui-validations";
import { ColumnStack, RowStack, Fit, Fixed } from "../ItemsStack/ItemsStack";
import FormattedNumberInput from "../FormattedNumberInput/FormattedNumberInput";
import StatusIcon from "../StatusIcon/StatusIcon";
import { defaultNumberEditFormat, defaultNumberViewFormat } from "../../Helpers/Formats";
import cn from "./TriggerSimpleModeEditor.less";

export type TriggerSimpleModeSettings = {
    warn_value: ?number,
    error_value: ?number,
};

type WatchType = "rising" | "falling";

type Props = {|
    triggerType: WatchType,
    value: TriggerSimpleModeSettings,
    onChange: TriggerSimpleModeSettings => void,
|};

type State = {
    watchFor: WatchType,
    risingValues: TriggerSimpleModeSettings,
    fallingValues: TriggerSimpleModeSettings,
};

export default class TriggerSimpleModeEditor extends React.Component<Props, State> {
    props: Props;
    state: State;

    constructor(props: Props) {
        super(props);
        const watchForType = this.getWatchForType(props.triggerType);
        this.state = {
            watchFor: watchForType,
            risingValues: watchForType === "rising" ? props.value : { warn_value: null, error_value: null },
            fallingValues: watchForType === "falling" ? props.value : { warn_value: null, error_value: null },
        };
    }

    getWatchForType(type: string): WatchType {
        if (type === "falling") {
            return type;
        }
        return "rising";
    }

    handleChangeWarnValue = (e: SyntheticEvent<>, warnValue: ?number) => {
        const { value, onChange } = this.props;
        const { watchFor } = this.state;
        if (watchFor === "rising") {
            this.setState({ risingValues: { ...value, warn_value: warnValue } });
        } else {
            this.setState({ fallingValues: { ...value, warn_value: warnValue } });
        }
        onChange({ ...value, warn_value: warnValue });
    };

    handleChangeErrorValue = (e: SyntheticEvent<>, errorValue: ?number) => {
        const { value, onChange } = this.props;
        const { watchFor } = this.state;
        if (watchFor === "rising") {
            this.setState({ risingValues: { ...value, error_value: errorValue } });
        } else {
            this.setState({ fallingValues: { ...value, error_value: errorValue } });
        }
        onChange({ ...value, error_value: errorValue });
    };

    handleSetRisingWatchType = () => {
        const { onChange } = this.props;
        const { risingValues } = this.state;
        this.setState({ watchFor: "rising" });
        onChange({ trigger_type: "rising", ...risingValues });
    };

    handleSetFallingWatchType = () => {
        const { onChange } = this.props;
        const { fallingValues } = this.state;
        this.setState({ watchFor: "falling" });
        onChange({ trigger_type: "falling", ...fallingValues });
    };

    validateRisingWarn(): ?ValidationInfo {
        const { watchFor } = this.state;
        if (watchFor !== "rising") {
            return null;
        }
        const { value } = this.props;
        if (value.warn_value == null && value.error_value == null) {
            return { message: "At least one of values must be filled", type: "submit" };
        }

        return null;
    }

    validateRisingError(): ?ValidationInfo {
        const { watchFor } = this.state;
        if (watchFor !== "rising") {
            return null;
        }
        const { value } = this.props;
        if (value.error_value == null && value.warn_value == null) {
            return { message: "At least one of values must be filled", type: "submit" };
        }
        if (value.error_value != null && value.warn_value != null && value.warn_value >= value.error_value) {
            return { message: "Error value must be greater than to warn value", type: "submit" };
        }
        return null;
    }

    validateFallingWarn(): ?ValidationInfo {
        const { watchFor } = this.state;
        if (watchFor !== "falling") {
            return null;
        }
        const { value } = this.props;
        if (value.warn_value == null && value.error_value == null) {
            return { message: "At least one of values must be filled", type: "submit" };
        }
        return null;
    }

    validateFallingError(): ?ValidationInfo {
        const { watchFor } = this.state;
        if (watchFor !== "falling") {
            return null;
        }
        const { value } = this.props;
        if (value.error_value == null && value.warn_value == null) {
            return { message: "At least one of values must be filled", type: "submit" };
        }
        if (value.error_value != null && value.warn_value != null && value.warn_value <= value.error_value) {
            return { message: "Error value must be less than to warn value", type: "submit" };
        }
        return null;
    }

    render(): React.Node {
        const { watchFor, risingValues, fallingValues } = this.state;
        const { value } = this.props;

        return (
            <div>
                <ColumnStack block gap={4} stretch>
                    <Fit>
                        <ColumnStack block gap={2} stretch>
                            <Fit>
                                <span className={cn("radio")} onClick={this.handleSetRisingWatchType}>
                                    <Radio checked={watchFor === "rising"} value="rising">
                                        Watch for value rising:
                                    </Radio>
                                </span>
                            </Fit>
                            <Fit className={cn("state-block")}>
                                <RowStack block baseline gap={2}>
                                    <Fit>
                                        <StatusIcon disabled={watchFor !== "rising"} status={"WARN"} />
                                    </Fit>
                                    <Fixed
                                        className={cn("state-caption", { disabled: watchFor !== "rising" })}
                                        width={100}>
                                        WARN if T1 &gt;={" "}
                                    </Fixed>
                                    <Fit>
                                        <ValidationWrapperV1
                                            renderMessage={tooltip("right middle")}
                                            validationInfo={this.validateRisingWarn()}>
                                            <FormattedNumberInput
                                                width={120}
                                                editFormat={defaultNumberEditFormat}
                                                viewFormat={defaultNumberViewFormat}
                                                value={
                                                    watchFor === "rising" ? value.warn_value : risingValues.warn_value
                                                }
                                                onChange={this.handleChangeWarnValue}
                                                disabled={watchFor !== "rising"}
                                            />
                                        </ValidationWrapperV1>
                                    </Fit>
                                </RowStack>
                            </Fit>
                            <Fit className={cn("state-block")}>
                                <RowStack block baseline gap={2}>
                                    <Fit>
                                        <StatusIcon disabled={watchFor !== "rising"} status={"ERROR"} />
                                    </Fit>
                                    <Fixed
                                        className={cn("state-caption", { disabled: watchFor !== "rising" })}
                                        width={100}>
                                        ERROR if T1 &gt;={" "}
                                    </Fixed>
                                    <Fit>
                                        <ValidationWrapperV1
                                            renderMessage={tooltip("right middle")}
                                            validationInfo={this.validateRisingError()}>
                                            <FormattedNumberInput
                                                width={120}
                                                editFormat={defaultNumberEditFormat}
                                                viewFormat={defaultNumberViewFormat}
                                                value={
                                                    watchFor === "rising" ? value.error_value : risingValues.error_value
                                                }
                                                onChange={this.handleChangeErrorValue}
                                                disabled={watchFor !== "rising"}
                                            />
                                        </ValidationWrapperV1>
                                    </Fit>
                                </RowStack>
                            </Fit>
                        </ColumnStack>
                    </Fit>
                    <Fit>
                        <ColumnStack block gap={2} stretch>
                            <Fit>
                                <span className={cn("radio")} onClick={this.handleSetFallingWatchType}>
                                    <Radio checked={watchFor === "falling"} value="falling">
                                        Watch for value falling:
                                    </Radio>
                                </span>
                            </Fit>

                            <Fit className={cn("state-block")}>
                                <RowStack block baseline gap={2}>
                                    <Fit>
                                        <StatusIcon disabled={watchFor !== "falling"} status={"WARN"} />
                                    </Fit>
                                    <Fixed
                                        className={cn("state-caption", { disabled: watchFor !== "falling" })}
                                        width={100}>
                                        WARN if T1 &lt;={" "}
                                    </Fixed>
                                    <Fit>
                                        <ValidationWrapperV1
                                            renderMessage={tooltip("right middle")}
                                            validationInfo={this.validateFallingWarn()}>
                                            <FormattedNumberInput
                                                width={120}
                                                editFormat={defaultNumberEditFormat}
                                                viewFormat={defaultNumberViewFormat}
                                                value={
                                                    watchFor === "falling" ? value.warn_value : fallingValues.warn_value
                                                }
                                                onChange={this.handleChangeWarnValue}
                                                disabled={watchFor !== "falling"}
                                            />
                                        </ValidationWrapperV1>
                                    </Fit>
                                </RowStack>
                            </Fit>
                            <Fit className={cn("state-block")}>
                                <RowStack block baseline gap={2}>
                                    <Fit>
                                        <StatusIcon disabled={watchFor !== "falling"} status={"ERROR"} />
                                    </Fit>
                                    <Fixed
                                        className={cn("state-caption", { disabled: watchFor !== "falling" })}
                                        width={100}>
                                        ERROR if T1 &lt;={" "}
                                    </Fixed>
                                    <Fit>
                                        <ValidationWrapperV1
                                            renderMessage={tooltip("right middle")}
                                            validationInfo={this.validateFallingError()}>
                                            <FormattedNumberInput
                                                width={120}
                                                editFormat={defaultNumberEditFormat}
                                                viewFormat={defaultNumberViewFormat}
                                                value={
                                                    watchFor === "falling"
                                                        ? value.error_value
                                                        : fallingValues.error_value
                                                }
                                                onChange={this.handleChangeErrorValue}
                                                disabled={watchFor !== "falling"}
                                            />
                                        </ValidationWrapperV1>
                                    </Fit>
                                </RowStack>
                            </Fit>
                        </ColumnStack>
                    </Fit>
                </ColumnStack>
            </div>
        );
    }
}
