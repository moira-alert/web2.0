import React, { FC, useEffect, useState } from "react";
import { ValidationWrapperV1, tooltip, ValidationInfo } from "@skbkontur/react-ui-validations";
import { Tabs } from "@skbkontur/react-ui/components/Tabs";
import { Input } from "@skbkontur/react-ui/components/Input";
import { Trigger, TriggerType } from "../../Domain/Trigger";
import TriggerSimpleModeEditor from "../TriggerSimpleModeEditor/TriggerSimpleModeEditor";
import { RowStack, Fit, Fill } from "../ItemsStack/ItemsStack";
import HelpTooltip from "../HelpTooltip/HelpTooltip";
import { TooltipExpressionHelp } from "./Components/TooltipExpressionHelp/TooltipExpressionHelp";
import classNames from "classnames/bind";

import styles from "./TriggerModeEditor.module.less";

const cn = classNames.bind(styles);

type WatchForType = "rising" | "falling";

export type ValueType = {
    warn_value: number | null;
    error_value: number | null;
};

type IProps = {
    disableSimpleMode?: boolean;
    triggerType: TriggerType;
    value: ValueType;
    expression: string;
    validateExpression: (value: string, message?: string) => ValidationInfo | null | undefined;
    onChange: (update: Partial<Trigger>) => void;
};

export const TriggerModeEditor: FC<IProps> = ({
    disableSimpleMode,
    triggerType,
    value,
    expression,
    validateExpression,
    onChange,
}) => {
    const getWatchForType = (type: string): WatchForType => {
        return type === "falling" ? type : "rising";
    };

    const getModeType = (type: string): string => {
        return type === "expression" ? "advanced" : "simple";
    };

    const [mode, setMode] = useState<string>(getModeType(triggerType));
    const [watchForField, setWatchForField] = useState<WatchForType>(getWatchForType(triggerType));
    const [values, setValues] = useState<ValueType>(value);

    const handleTabChange = (value: string): void => {
        if (!disableSimpleMode) {
            const triggerType = value === "advanced" ? "expression" : watchForField;
            onChange({ trigger_type: triggerType });
            setMode(value);
        }
    };

    const handleRadioChange = (type: WatchForType): void => {
        setWatchForField(type);
        onChange({ trigger_type: type, ...values });
    };

    const handleInputChange = (value: number | null, valueType: string): void => {
        setValues((prev) => ({ ...prev, [valueType]: value }));
        onChange({ [valueType]: value });
    };

    const configureValues = (watchForType: WatchForType) =>
        watchForField === `${watchForType}` ? values : { warn_value: null, error_value: null };

    useEffect(() => {
        disableSimpleMode && setMode("advanced");
    });

    return (
        <>
            <div className={cn("tabs")}>
                <Tabs value={mode} onValueChange={handleTabChange}>
                    <Tabs.Tab disabled={disableSimpleMode} id="simple">
                        Simple mode
                    </Tabs.Tab>
                    <Tabs.Tab id="advanced">Advanced mode</Tabs.Tab>
                </Tabs>
            </div>
            {mode === "simple" && (
                <TriggerSimpleModeEditor
                    watchFor={watchForField}
                    risingValues={configureValues("rising")}
                    fallingValues={configureValues("falling")}
                    onChange={handleInputChange}
                    onSwitch={handleRadioChange}
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
                                />
                            </ValidationWrapperV1>
                        </Fill>
                        <Fit>
                            &nbsp;
                            <HelpTooltip>{TooltipExpressionHelp()}</HelpTooltip>
                        </Fit>
                    </RowStack>
                </div>
            )}
        </>
    );
};
