import * as React from "react";
import { ValidationWrapperV1, tooltip, ValidationInfo } from "@skbkontur/react-ui-validations";
import { Tabs } from "@skbkontur/react-ui/components/Tabs";
import { Input } from "@skbkontur/react-ui/components/Input";
import { Link } from "@skbkontur/react-ui/components/Link";
import { Trigger, TriggerType } from "../../Domain/Trigger";
import TriggerSimpleModeEditor from "../TriggerSimpleModeEditor/TriggerSimpleModeEditor";
import { RowStack, Fit, Fill } from "../ItemsStack/ItemsStack";
import CodeRef from "../CodeRef/CodeRef";
import HelpTooltip from "../HelpTooltip/HelpTooltip";
import cn from "./TriggerModeEditor.less";

type WatchForType = "rising" | "falling";

export type ValueType = {
    warn_value: number | null;
    error_value: number | null;
};

type Props = {
    disableSimpleMode?: boolean;
    triggerType: TriggerType;
    value: ValueType;
    expression: string;
    validateExpression: (value: string, message?: string) => ValidationInfo | null | undefined;
    onChange: (update: Partial<Trigger>) => void;
};

type State = {
    mode: string;
    watchFor: WatchForType;
    risingValues: ValueType;
    fallingValues: ValueType;
};

export default class TriggerModeEditor extends React.Component<Props, State> {
    static getDerivedStateFromProps(props: Props): State {
        const modeType = TriggerModeEditor.getModeType(props.triggerType);
        const watchForType = TriggerModeEditor.getWatchForType(props.triggerType);

        return {
            mode: modeType,
            watchFor: watchForType,
            risingValues:
                watchForType === "rising" ? props.value : { warn_value: null, error_value: null },
            fallingValues:
                watchForType === "falling" ? props.value : { warn_value: null, error_value: null },
        };
    }

    static getWatchForType(type: string): WatchForType {
        return type === "falling" ? type : "rising";
    }

    static getModeType(type: string): string {
        return type === "expression" ? "advanced" : "simple";
    }

    render(): React.ReactElement {
        const { mode, watchFor, risingValues, fallingValues } = this.state;
        const { expression, disableSimpleMode, validateExpression, onChange } = this.props;

        return (
            <>
                <div className={cn("tabs")}>
                    <Tabs value={mode} onValueChange={this.handleTabChange}>
                        <Tabs.Tab id="simple" style={{ color: disableSimpleMode ? "#888888" : "" }}>
                            Simple mode
                        </Tabs.Tab>
                        <Tabs.Tab id="advanced">Advanced mode</Tabs.Tab>
                    </Tabs>
                </div>
                {mode === "simple" && (
                    <TriggerSimpleModeEditor
                        watchFor={watchFor}
                        risingValues={risingValues}
                        fallingValues={fallingValues}
                        onChange={this.handleInputChange}
                        onSwitch={this.handleRadioChange}
                    />
                )}
                {mode === "advanced" && (
                    <div className={cn("advanced")}>
                        <RowStack verticalAlign="baseline" block>
                            <Fill>
                                <ValidationWrapperV1
                                    validationInfo={validateExpression(
                                        expression,
                                        "Expression can't be empty"
                                    )}
                                    renderMessage={tooltip("right middle")}
                                >
                                    <Input
                                        width="100%"
                                        value={expression}
                                        onValueChange={(value) => onChange({ expression: value })}
                                        placeholder="t1 >= 10 ? ERROR : (t1 >= 1 ? WARN : OK)"
                                        data-tid="Expression"
                                    />
                                </ValidationWrapperV1>
                            </Fill>
                            <Fit>
                                &nbsp;
                                <HelpTooltip>{this.tooltipExpressionHelp()}</HelpTooltip>
                            </Fit>
                        </RowStack>
                    </div>
                )}
            </>
        );
    }

    handleTabChange = (value: string): void => {
        const { watchFor } = this.state;
        const { disableSimpleMode, onChange } = this.props;
        if (!disableSimpleMode) {
            const triggerType = value === "advanced" ? "expression" : watchFor;
            onChange({ trigger_type: triggerType });
        }
    };

    handleRadioChange = (type: WatchForType): void => {
        const { risingValues, fallingValues } = this.state;
        const { onChange } = this.props;
        const value = type === "falling" ? { ...fallingValues } : { ...risingValues };
        this.setState({ watchFor: type });
        onChange({ trigger_type: type, ...value });
    };

    handleInputChange = (value: number | null, valueType: string): void => {
        const { watchFor, risingValues, fallingValues } = this.state;
        const { onChange } = this.props;
        if (watchFor === "rising") {
            this.setState({ risingValues: { ...risingValues, [valueType]: value } });
        }
        if (watchFor === "falling") {
            this.setState({ fallingValues: { ...fallingValues, [valueType]: value } });
        }
        onChange({ [valueType]: value });
    };

    tooltipExpressionHelp = (): React.ReactNode => (
        <div className={cn("expression-help")}>
            <div className={cn("main-description")}>
                Expression uses{" "}
                <Link
                    target="_blank"
                    href="https://github.com/Knetic/govaluate/blob/master/MANUAL.md"
                >
                    govaluate
                </Link>{" "}
                with predefined constants:
            </div>
            <div>
                <CodeRef>t1</CodeRef>, <CodeRef>t2</CodeRef>, ... are values from your targets.
            </div>
            <div>
                <CodeRef>OK</CodeRef>, <CodeRef>WARN</CodeRef>, <CodeRef>ERROR</CodeRef>,{" "}
                <CodeRef>NODATA</CodeRef> are states that must be the result of evaluation.
            </div>
            <div>
                <CodeRef>PREV_STATE</CodeRef> is equal to previously set state, and allows you to
                prevent frequent state changes.
            </div>

            <div className={cn("note")}>
                NOTE: Only T1 target can resolve into multiple metrics in Advanced Mode. T2, T3, ...
                must resolve to single metrics.
            </div>
        </div>
    );
}
