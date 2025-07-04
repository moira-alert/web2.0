import React, { useEffect, useState } from "react";
import TriggerSource, { ValidateTriggerTarget } from "../../Domain/Trigger";
import ErrorMessage from "./ErrorMessage/ErrorMessage";
import { CodeEditor } from "./CodeEditor";
import { getProblemMessage, validateQuery } from "../../Domain/Target";
import { ValidationWrapperV1, tooltip } from "@skbkontur/react-ui-validations";

import classNames from "classnames/bind";

import styles from "./HighlightInput.module.less";

const cn = classNames.bind(styles);

type HighlightInputProps = {
    value: string;
    onValueChange: (value: string) => void;
    triggerSource?: TriggerSource;
    validate?: ValidateTriggerTarget;
    "data-tid"?: string;
};

export default function HighlightInput(props: HighlightInputProps): React.ReactElement {
    const { value, onValueChange, triggerSource, validate } = props;
    const [changed, setChanged] = useState<boolean>(false);
    const [error, setErrorMessage] = useState<string | undefined>(undefined);
    const [warning, setWarningMessage] = useState<string | undefined>(undefined);

    const resetValidationState = () => {
        setChanged(false);
        setWarningMessage(undefined);
        setErrorMessage(undefined);
    };

    const handleInputBlur = () => {
        resetValidationState();
    };

    const handleValueChange = (changedValue: string) => {
        onValueChange(changedValue);
        resetValidationState();
    };

    useEffect(() => {
        let errorMessage: string | undefined;
        let warningMessage: string | undefined;
        if (validate) {
            if (validate.syntax_ok) {
                if (validate.tree_of_problems) {
                    ({ error: errorMessage, warning: warningMessage } = getProblemMessage(
                        validate.tree_of_problems
                    ));
                }
            } else if (value.trim().length !== 0) {
                errorMessage = "Syntax error";
            }
        }
        setErrorMessage(errorMessage);
        setWarningMessage(warningMessage);
    }, [validate]);

    return (
        <>
            <div className={cn("messageContainer")}>
                <ValidationWrapperV1
                    validationInfo={validateQuery(value, warning, error)}
                    renderMessage={tooltip("right middle")}
                >
                    <CodeEditor
                        data-tid={props["data-tid"] ?? ""}
                        triggerSource={triggerSource}
                        onBlur={handleInputBlur}
                        problemTree={validate?.tree_of_problems}
                        value={value}
                        onValueChange={handleValueChange}
                    />
                </ValidationWrapperV1>
            </div>
            <ErrorMessage error={error} warning={warning} view={!changed} />
        </>
    );
}
