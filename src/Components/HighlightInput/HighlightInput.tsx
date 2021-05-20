import React, { useState, useRef, useEffect } from "react";
import { Input, ThemeContext, ThemeFactory, DEFAULT_THEME } from "@skbkontur/react-ui";
import { tooltip, ValidationWrapperV1 } from "@skbkontur/react-ui-validations";
import { ValidationInfo } from "@skbkontur/react-ui-validations";
import { ValidateTriggerTarget } from "../../Domain/Trigger";
import parseExpression, { isEmptyString } from "./parser/parseExpression";
import ErrorMessage from "./ErrorMessage/ErrorMessage";
import { highlightTokens, renderToken } from "./highlightFunctions";
import cn from "./HighlightInput.less";

type HighlightInputProps = {
    onValueChange: (value: string) => void;
    value: string;
    width?: string;
    validate?: ValidateTriggerTarget;
    "data-tid"?: string;
};

function validateInput(
    value: string,
    validateTarget?: ValidateTriggerTarget
): ValidationInfo | null {
    if (isEmptyString(value)) {
        return {
            type: "submit",
            message: "Can't be empty",
        };
    }
    if (validateTarget?.length) {
        return {
            type: "lostfocus",
            level: validateTarget.some((validate) => validate.level === "bad")
                ? "error"
                : "warning",
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
        onValueChange(changedValue);
    };

    let highlightText: React.ReactNode | undefined;

    const valueTokens = parseExpression(value);

    valueTokens.forEach((v) => (v.value = v.value.replace(/\s/g, "\u00a0")));
    const viewTokens = highlightTokens(valueTokens, caret);

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

        return () => {
            input.removeEventListener("scroll", handleScroll);
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
                        validationInfo={validateInput(value, validate)}
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
            {changed ? null : <ErrorMessage validateTarget={validate} />}
        </>
    );
}
