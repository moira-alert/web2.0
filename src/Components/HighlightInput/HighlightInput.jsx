// @flow
import React, { useState, useRef, useEffect } from "react";
import { Input, ThemeContext, ThemeFactory, DEFAULT_THEME } from "@skbkontur/react-ui";
import { tooltip, ValidationWrapperV1 } from "@skbkontur/react-ui-validations";
import type { ValidationInfo } from "@skbkontur/react-ui-validations";
import type { TriggerTargetsCheck, TriggerTargetProblem } from "../../Domain/Trigger";
import parseExpression, { isEmptyString } from "./parser/parseExpression";
import ErrorMessage from "./ErrorMessage/ErrorMessage";
import cn from "./HighlightInput.less";
import { highlightBadFunction, highlightTokens, renderToken } from "./highlightFunctions";

type HighlightInputProps = {
    onValueChange: string => void,
    value: string,
    width?: string,
    validate?: TriggerTargetsCheck,
    validateRequested?: boolean,
};

type FunctionTree = {
    name: string,
    children: Array<FunctionTree>,
};

function getProblemMessage(
    problemTree: TriggerTargetProblem
): { error?: string, warning?: string } {
    if (problemTree.type === "bad") {
        return { error: `${problemTree.argument}: ${problemTree.description}` };
    }

    let errorMessage: string | undefined;
    let warningMessage =
        problemTree.type === "warn"
            ? `${problemTree.argument}: ${problemTree.description}`
            : undefined;

    if (problemTree.problems) {
        problemTree.problems.forEach(problem => {
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
    }

    return { error: errorMessage, warning: warningMessage };
}

function validateInput(value: string, error?: string, warning?: string): ?ValidationInfo {
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
        };
    }

    return null;
}

export default function HighlightInput(props: HighlightInputProps) {
    const { value, onValueChange, validate, validateRequested, width } = props;
    const [scrollLeft, setScrollLeft] = useState<number>(0);
    const [caret, setCaret] = useState<number | undefined>(undefined);
    const inputEl = useRef<Input>(null);
    const containerEl = useRef<HTMLElement>(null);

    const [validationView, setValidationView] = useState<boolean>(false);
    const handleInputBlur = () => setValidationView(true);

    const handleValueChange = (changedValue: string) => {
        setValidationView(false);
        onValueChange(changedValue);
    };

    let errorMessage: string | undefined;
    let warningMessage: string | undefined;
    let highlightText: string | undefined;

    const valueTokens = parseExpression(value);
    // fix hiding boundary spaces in span
    // eslint-disable-next-line no-return-assign, no-param-reassign
    valueTokens.forEach(v => (v.value = v.value.replace(/\s/g, "\u00a0")));
    const viewTokens = highlightTokens(valueTokens, caret);

    if (validate) {
        if (validate.syntax_ok) {
            if (validate.tree_of_problems) {
                highlightText = highlightBadFunction(
                    validate.tree_of_problems,
                    viewTokens,
                    containerEl.current
                );

                ({ error: errorMessage, warning: warningMessage } = getProblemMessage(
                    validate.tree_of_problems
                ));
            }
        } else {
            errorMessage = "Syntax error";
        }
    }

    if (!highlightText) {
        highlightText = viewTokens.map(renderToken);
    }

    useEffect((): undefined | (() => void) => {
        if (!inputEl.current) {
            return undefined;
        }
        const { input } = inputEl.current;
        const handleScroll = e => setScrollLeft(e.target.scrollLeft);
        input.addEventListener("scroll", handleScroll);

        return () => {
            input.removeEventListener("scroll", handleScroll);
        };
    }, [setScrollLeft]);

    useEffect(() => {
        if (!inputEl.current) {
            return undefined;
        }
        const { input } = inputEl.current;
        const handleKeyDown = e => setCaret(e.target.selectionStart);
        const handleBlur = () => setCaret(undefined);

        input.addEventListener("keyup", handleKeyDown);
        input.addEventListener("mouseup", handleKeyDown);
        input.addEventListener("blur", handleBlur);

        return () => {
            input.removeEventListener("keyup", handleKeyDown);
            input.removeEventListener("mouseup", handleKeyDown);
            input.removeEventListener("blur", handleBlur);
        };
    }, [setCaret]);

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
                        <Input
                            ref={inputEl}
                            value={value}
                            width={width}
                            onValueChange={handleValueChange}
                            onBlur={handleInputBlur}
                        />
                    </ValidationWrapperV1>
                </ThemeContext.Provider>
                <span className={cn("message")} ref={containerEl}>
                    <span style={{ marginLeft: `-${scrollLeft}px` }}>{highlightText}</span>
                </span>
            </div>
            {
                <ErrorMessage
                    error={errorMessage}
                    warning={warningMessage}
                    view={validationView && !validateRequested}
                />
            }
        </>
    );
}
