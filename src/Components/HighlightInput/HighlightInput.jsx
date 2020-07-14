// @flow
import React, { useState, useRef, useEffect } from "react";
import { Input, ThemeContext, ThemeFactory, DEFAULT_THEME } from "@skbkontur/react-ui";
import type { TriggerFunctionCheck, TriggerFunctionProblem } from "../../Domain/Trigger";
import parseExpression from "./parser/parseExpression";
import ErrorMessage from "./ErrorMessage/ErrorMessage";
import cn from "./HighlightInput.less";
import { highlightBadFunction, highlightTokens, renderToken } from "./highlightFunctions";

type HighlightInputProps = {
    onValueChange: string => void,
    value: string,
    validate?: TriggerFunctionCheck,
};

type FunctionTree = {
    name: string,
    children: Array<FunctionTree>,
};

function getProblemMessage(
    problemTree: TriggerFunctionProblem
): { error?: string, warning?: string } {
    if (problemTree.type === "bad") {
        return { error: problemTree.description };
    }
    const message = {
        warning: problemTree.type === "warn" ? problemTree.description : undefined,
    };

    if (!problemTree.problems) {
        return message;
    }

    problemTree.problems.forEach(problem => {
        if (message.error) {
            return;
        }
        const { error, warning } = getProblemMessage(problem);

        if (error) {
            message.error = error;
        }
        if (warning && !message.warning) {
            message.warning = warning;
        }
    });

    return message;
}

export default function HighlightInput(props: HighlightInputProps) {
    const { value, onValueChange, validate } = props;
    const [scrollLeft, setScrollLeft] = useState<number>(0);
    const [caret, setCaret] = useState<number | undefined>(undefined);
    const inputEl = useRef<Input>(null);
    let error: string | undefined;
    let warning: string | undefined;
    let highlightText: string | undefined;

    const valueTokens = parseExpression(value);
    // fix hiding boundary spaces in span
    // eslint-disable-next-line no-return-assign, no-param-reassign
    valueTokens.forEach(v => (v.value = v.value.replace(/\s/g, "\u00a0")));
    const viewTokens = highlightTokens(valueTokens, caret);

    if (validate) {
        if (validate.syntax_ok) {
            if (validate.tree_of_problems) {
                highlightText = highlightBadFunction(validate.tree_of_problems, viewTokens);

                ({ error, warning } = getProblemMessage(validate.tree_of_problems));
            }
        } else {
            error = "Can't parse expression";
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
            <div className={cn("messageContainer")}>
                <ThemeContext.Provider
                    value={ThemeFactory.create(
                        {
                            inputBg: "rgba(0, 0, 0, 0)",
                            inputTextColor: "rgba(0, 0, 0, 0)",
                        },
                        DEFAULT_THEME
                    )}
                >
                    <Input
                        ref={inputEl}
                        value={value}
                        onValueChange={onValueChange}
                        error={Boolean(error)}
                        warning={Boolean(warning)}
                    />
                </ThemeContext.Provider>
                <span className={cn("message")}>
                    <span style={{ marginLeft: `-${scrollLeft}px` }}>{highlightText}</span>
                </span>
            </div>
            <ErrorMessage error={error} warning={warning} />
        </>
    );
}
