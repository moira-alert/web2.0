import React, { useState, useRef, useEffect } from "react";
import { Input, ThemeContext, ThemeFactory, DEFAULT_THEME } from "@skbkontur/react-ui";
import { tooltip, ValidationWrapperV1 } from "@skbkontur/react-ui-validations";
import { ValidationInfo } from "@skbkontur/react-ui-validations";
import { ValidateTriggerTarget, TriggerTargetProblem } from "../../Domain/Trigger";
import parseExpression, { isEmptyString } from "./parser/parseExpression";
import ErrorMessage from "./ErrorMessage/ErrorMessage";
import { highlightBadFunction, highlightTokens, renderToken } from "./highlightFunctions";
import cn from "./HighlightInput.less";

type HighlightInputProps = {
    onValueChange: (changedValue: string) => void;
    value: string,
    width?: string,
    validate?: ValidateTriggerTarget,
    "data-tid"?: string,
};

function getProblemMessage(
    problemTree: TriggerTargetProblem
): { error?: string; warning?: string } {
    if (problemTree.type === "bad") {
        return { error: `${problemTree.argument}: ${problemTree.description}` };
    }

    let errorMessage: string | undefined;
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
            message: "Error or warning happened",
        };
    }

    return null;
}

export default function HighlightInput(props: HighlightInputProps): React.ReactElement {
    const { value, onValueChange, validate, width } = props;
    const [scrollLeft, setScrollLeft] = useState<number>(0);
    const [caret, setCaret] = useState<number | null>(null);
    const inputEl = useRef<Input>(null);
    const containerEl = useRef<HTMLElement>(null);

    const [changed, setChanged] = useState<boolean>(false);
    const handleInputBlur = () => setChanged(false);

    const handleValueChange = (changedValue: string) => {
        setChanged(true);
        onValueChange(changedValue);
    };

    let errorMessage: string | undefined;
    let warningMessage: string | undefined;
    let highlightText: React.ReactNode | undefined;

    const valueTokens = parseExpression(value);
    // fix hiding boundary spaces in span
    // eslint-disable-next-line no-return-assign, no-param-reassign
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
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { input } = inputEl.current;
        const handleScroll = (e: React.SyntheticEvent<HTMLInputElement>) =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            setScrollLeft(e.target?.scrollLeft);
        input.addEventListener("scroll", handleScroll);

        return () => {
            input.removeEventListener("scroll", handleScroll);
        };
    }, [setScrollLeft]);

    useEffect(() => {
        if (!inputEl.current) {
            return undefined;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const { input } = inputEl.current;
        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
            const target = e.target as HTMLInputElement;
            return setCaret(target.selectionStart);
        };
        const handleBlur = () => setCaret(null);

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
                            data-tid={props["data-tid"]}
                        />
                    </ValidationWrapperV1>
                </ThemeContext.Provider>
                <span className={cn("message")} ref={containerEl}>
                    <span style={{ marginLeft: `-${scrollLeft}px` }}>{highlightText}</span>
                </span>
            </div>
            <ErrorMessage error={errorMessage} warning={warningMessage} view={!changed} />
        </>
    );
}
