// @flow
import * as React from "react";
import { Radio } from "@skbkontur/react-ui/components/Radio";
import { ValidationWrapperV1, tooltip, type ValidationInfo } from "@skbkontur/react-ui-validations";
import { ColumnStack, RowStack, Fit, Fixed } from "../ItemsStack/ItemsStack";
import FormattedNumberInput from "../FormattedNumberInput/FormattedNumberInput";
import StatusIcon from "../StatusIcon/StatusIcon";
import { defaultNumberEditFormat, defaultNumberViewFormat } from "../../helpers/Formats";
import cn from "./TriggerSimpleModeEditor.less";

export type TriggerSimpleModeSettings = {
    warn_value: ?number,
    error_value: ?number,
};

type WatchForType = "rising" | "falling";

type ValueType = {
    warn_value: number | null,
    error_value: number | null,
};

type Props = {|
    watchFor: WatchForType,
    risingValues: ValueType,
    fallingValues: ValueType,
    onChange: (value: number | null, valueType: string) => void,
    onSwitch: (type: WatchForType) => void,
|};

export default class TriggerSimpleModeEditor extends React.Component<Props> {
    props: Props;

    render(): React.Node {
        const { watchFor, risingValues, fallingValues } = this.props;
        return (
            <div>
                <ColumnStack block gap={4} stretch>
                    <Fit>
                        <ColumnStack block gap={2} stretch>
                            <Fit>
                                <span className={cn("radio")}>
                                    <Radio
                                        checked={watchFor === "rising"}
                                        value="rising"
                                        onValueChange={this.handleSetWatchType}
                                    >
                                        Watch for value rising:
                                    </Radio>
                                </span>
                            </Fit>
                            <Fit className={cn("state-block")}>
                                <RowStack block baseline gap={2}>
                                    <Fit>
                                        <StatusIcon
                                            disabled={watchFor !== "rising"}
                                            status="WARN"
                                        />
                                    </Fit>
                                    <Fixed
                                        className={cn("state-caption", {
                                            disabled: watchFor !== "rising",
                                        })}
                                        width={100}
                                    >
                                        WARN if T1 ≥{" "}
                                    </Fixed>
                                    <Fit>
                                        <ValidationWrapperV1
                                            renderMessage={tooltip("right middle")}
                                            validationInfo={this.validateRisingWarn()}
                                        >
                                            <FormattedNumberInput
                                                width={120}
                                                editFormat={defaultNumberEditFormat}
                                                viewFormat={defaultNumberViewFormat}
                                                value={risingValues.warn_value}
                                                onChange={this.handleChangeWarnValue}
                                                disabled={watchFor !== "rising"}
                                                data-tid="WARN T1"
                                            />
                                        </ValidationWrapperV1>
                                    </Fit>
                                </RowStack>
                            </Fit>
                            <Fit className={cn("state-block")}>
                                <RowStack block baseline gap={2}>
                                    <Fit>
                                        <StatusIcon
                                            disabled={watchFor !== "rising"}
                                            status="ERROR"
                                        />
                                    </Fit>
                                    <Fixed
                                        className={cn("state-caption", {
                                            disabled: watchFor !== "rising",
                                        })}
                                        width={100}
                                    >
                                        ERROR if T1 ≥{" "}
                                    </Fixed>
                                    <Fit>
                                        <ValidationWrapperV1
                                            renderMessage={tooltip("right middle")}
                                            validationInfo={this.validateRisingError()}
                                        >
                                            <FormattedNumberInput
                                                width={120}
                                                editFormat={defaultNumberEditFormat}
                                                viewFormat={defaultNumberViewFormat}
                                                value={risingValues.error_value}
                                                onChange={this.handleChangeErrorValue}
                                                disabled={watchFor !== "rising"}
                                                data-tid="ERROR T1"
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
                                <span className={cn("radio")}>
                                    <Radio
                                        checked={watchFor === "falling"}
                                        value="falling"
                                        onValueChange={this.handleSetWatchType}
                                    >
                                        Watch for value falling:
                                    </Radio>
                                </span>
                            </Fit>

                            <Fit className={cn("state-block")}>
                                <RowStack block baseline gap={2}>
                                    <Fit>
                                        <StatusIcon
                                            disabled={watchFor !== "falling"}
                                            status="WARN"
                                        />
                                    </Fit>
                                    <Fixed
                                        className={cn("state-caption", {
                                            disabled: watchFor !== "falling",
                                        })}
                                        width={100}
                                    >
                                        WARN if T1 ≤{" "}
                                    </Fixed>
                                    <Fit>
                                        <ValidationWrapperV1
                                            renderMessage={tooltip("right middle")}
                                            validationInfo={this.validateFallingWarn()}
                                        >
                                            <FormattedNumberInput
                                                width={120}
                                                editFormat={defaultNumberEditFormat}
                                                viewFormat={defaultNumberViewFormat}
                                                value={fallingValues.warn_value}
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
                                        <StatusIcon
                                            disabled={watchFor !== "falling"}
                                            status="ERROR"
                                        />
                                    </Fit>
                                    <Fixed
                                        className={cn("state-caption", {
                                            disabled: watchFor !== "falling",
                                        })}
                                        width={100}
                                    >
                                        ERROR if T1 ≤{" "}
                                    </Fixed>
                                    <Fit>
                                        <ValidationWrapperV1
                                            renderMessage={tooltip("right middle")}
                                            validationInfo={this.validateFallingError()}
                                        >
                                            <FormattedNumberInput
                                                width={120}
                                                editFormat={defaultNumberEditFormat}
                                                viewFormat={defaultNumberViewFormat}
                                                value={fallingValues.error_value}
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

    handleChangeWarnValue = (warnValue: number | null) => {
        const { onChange } = this.props;
        onChange(warnValue, "warn_value");
    };

    handleChangeErrorValue = (errorValue: number | null) => {
        const { onChange } = this.props;
        onChange(errorValue, "error_value");
    };

    handleSetWatchType = (type: WatchForType) => {
        const { onSwitch } = this.props;
        onSwitch(type);
    };

    validateRisingWarn(): ?ValidationInfo {
        const { watchFor, risingValues: value } = this.props;
        if (watchFor !== "rising") {
            return null;
        }
        if (value.warn_value == null && value.error_value == null) {
            return { message: "At least one of values must be filled", type: "submit" };
        }

        return null;
    }

    validateRisingError(): ?ValidationInfo {
        const { watchFor, risingValues: value } = this.props;
        if (watchFor !== "rising") {
            return null;
        }
        if (value.error_value == null && value.warn_value == null) {
            return { message: "At least one of values must be filled", type: "submit" };
        }
        if (
            value.error_value != null &&
            value.warn_value != null &&
            value.warn_value >= value.error_value
        ) {
            return { message: "Error value must be greater than to warn value", type: "submit" };
        }
        return null;
    }

    validateFallingWarn(): ?ValidationInfo {
        const { watchFor, fallingValues: value } = this.props;
        if (watchFor !== "falling") {
            return null;
        }
        if (value.warn_value == null && value.error_value == null) {
            return { message: "At least one of values must be filled", type: "submit" };
        }
        return null;
    }

    validateFallingError(): ?ValidationInfo {
        const { watchFor, fallingValues: value } = this.props;
        if (watchFor !== "falling") {
            return null;
        }
        if (value.error_value == null && value.warn_value == null) {
            return { message: "At least one of values must be filled", type: "submit" };
        }
        if (
            value.error_value != null &&
            value.warn_value != null &&
            value.warn_value <= value.error_value
        ) {
            return { message: "Error value must be less than to warn value", type: "submit" };
        }
        return null;
    }
}
