import React, { useState, useRef, useEffect } from "react";
import { Input, ThemeContext, ThemeFactory, DEFAULT_THEME } from "@skbkontur/react-ui";
import { tooltip, ValidationWrapperV1 } from "@skbkontur/react-ui-validations";
import { ValidationInfo } from "@skbkontur/react-ui-validations";
import { ValidateTriggerTarget, TriggerTargetProblem } from "../../Domain/Trigger";
import parseExpression, { isEmptyString } from "./parser/parseExpression";
import ErrorMessage from "./ErrorMessage/ErrorMessage";
import { highlightBadFunction, highlightTokens, renderToken } from "./highlightFunctions";
import classNames from "classnames/bind";

import styles from "./HighlightInput.less";
import { CodeEditor } from "./CodeEditor";

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
    const [scrollLeft, setScrollLeft] = useState<number>(0);
    const [caret, setCaret] = useState<number | undefined>();
    const inputEl = useRef<Input>(null);
    const containerEl = useRef<HTMLElement>(null);

    const [changed, setChanged] = useState<boolean>(false);
    const handleInputBlur = () => setChanged(false);

    const handleValueChange = (changedValue: string) => {
        setChanged(true);
        onValueChange(changedValue.replace(/\s/g, ""));
    };

    let errorMessage: string | undefined;
    let warningMessage: string | undefined;
    let highlightText: React.ReactNode | undefined;

    const valueTokens = parseExpression(value);

    valueTokens.forEach((v) => (v.value = v.value.replace(/\s/g, "\u00a0")));
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
        } else if (value.trim().length !== 0) {
            errorMessage = "Syntax error";
        }
    }

    if (!highlightText) {
        highlightText = viewTokens.map(renderToken);
    }

    useEffect(() => {
        if (!inputEl.current) {
            return undefined;
        }

        // @ts-ignore otherwise we need to find by dom
        const { input } = inputEl.current;
        const handleScroll = (e: React.SyntheticEvent<HTMLInputElement>) =>
            setScrollLeft(e.currentTarget.scrollLeft);
        input.addEventListener("scroll", handleScroll);

        // "keyup" and "select" events for MacOS Safari, which doesn't support the "scroll" event on input
        input.addEventListener("keyup", handleScroll);
        input.addEventListener("select", handleScroll);

        return () => {
            input.removeEventListener("scroll", handleScroll);
            input.removeEventListener("keyup", handleScroll);
            input.removeEventListener("select", handleScroll);
        };
    }, [setScrollLeft]);

    useEffect(() => {
        if (!inputEl.current) {
            return undefined;
        }

        // @ts-ignore otherwise we need to find by dom
        const { input } = inputEl.current;
        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            return setCaret(e.currentTarget.selectionStart ?? 0);
        };
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
                        {/* <Input
                            ref={inputEl}
                            value={value}
                            width={width}
                            onValueChange={handleValueChange}
                            onBlur={handleInputBlur}
                            data-tid={props["data-tid"]}
                        /> */}
                        <CodeEditor
                            problemTree={validate?.tree_of_problems}
                            value={value}
                            onValueChange={handleValueChange}
                        />
                    </ValidationWrapperV1>
                </ThemeContext.Provider>
                {/* <span className={cn("message")} ref={containerEl}>
                    <span style={{ marginLeft: `-${scrollLeft}px` }}>{highlightText}</span>
                </span> */}
            </div>
            <ErrorMessage error={errorMessage} warning={warningMessage} view={!changed} />
        </>
    );
}
