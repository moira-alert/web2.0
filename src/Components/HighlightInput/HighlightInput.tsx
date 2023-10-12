import React, { useState, useRef } from "react";
import { Input, ThemeContext, ThemeFactory, DEFAULT_THEME } from "@skbkontur/react-ui";
import { tooltip, ValidationWrapperV1 } from "@skbkontur/react-ui-validations";
import { ValidationInfo } from "@skbkontur/react-ui-validations";
import { ValidateTriggerTarget, TriggerTargetProblem } from "../../Domain/Trigger";
import { isEmptyString } from "./parser/parseExpression";
import ErrorMessage from "./ErrorMessage/ErrorMessage";
import { CodeEditor } from "./CodeEditor";
import classNames from "classnames/bind";

import styles from "./HighlightInput.less";

const cn = classNames.bind(styles);

type HighlightInputProps = {
    onValueChange: (value: string) => void;
    value: string;
    width?: string;
    validate?: ValidateTriggerTarget;
    "data-tid"?: string;
};

function getProblemMessage(
    problemTree: TriggerTargetProblem
): { error?: string; warning?: string } {
    if (problemTree.type === "bad") {
        return { error: `${problemTree.argument}: ${problemTree.description}` };
    }

    let errorMessage: string | undefined = undefined;
    let warningMessage =
        problemTree.type === "warn"
            ? `${problemTree.argument}: ${problemTree.description}`
            : undefined;

    problemTree.problems?.forEach((problem) => {
        if (errorMessage) {
            return;
        }
        const { error, warning } = getProblemMessage(problem);
        if (error) {
            errorMessage = error;
        }
        if (!warningMessage && warningMessage) {
            warningMessage = warning;
        }
    });

    return { error: errorMessage, warning: warningMessage };
}

function validateInput(value: string, error?: string, warning?: string): ValidationInfo | null {
    if (isEmptyString(value)) {
        return {
            type: "submit",
            message: "Can't be empty",
        };
    }
    if (error || warning) {
        return {
            type: "lostfocus",
            level: error ? "error" : "warning",
            message: null,
        };
    }

    return null;
}

export default function HighlightInput(props: HighlightInputProps): React.ReactElement {
    const { value, onValueChange, validate, width } = props;
    const [changed, setChanged] = useState<boolean>(false);
    const handleInputBlur = () => setChanged(false);

    const handleValueChange = (changedValue: string) => {
        setChanged(true);
        onValueChange(changedValue.replace(/\s/g, ""));
    };

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

    return (
        <>
            <div className={cn("messageContainer")} style={{ width }}>
                <ThemeContext.Provider
                    value={ThemeFactory.create(
                        {
                            inputBg: "rgba(0, 0, 0, 0)",
                            inputTextColor: "rgba(0, 0, 0, 0)",
                        },
                        DEFAULT_THEME
                    )}
                >
                    <ValidationWrapperV1
                        validationInfo={validateInput(value, errorMessage, warningMessage)}
                        renderMessage={tooltip("right middle")}
                    >
                        <CodeEditor
                            onBlur={handleInputBlur}
                            problemTree={validate?.tree_of_problems}
                            width={width}
                            value={value}
                            onValueChange={handleValueChange}
                        />
                    </ValidationWrapperV1>
                </ThemeContext.Provider>
            </div>
            <ErrorMessage error={errorMessage} warning={warningMessage} view={!changed} />
        </>
    );
}
