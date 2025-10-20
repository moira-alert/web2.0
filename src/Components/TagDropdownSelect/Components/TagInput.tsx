import React, { useContext, forwardRef } from "react";
import { ScrollContainer } from "@skbkontur/react-ui/components/ScrollContainer";
import { Theme } from "@skbkontur/react-ui/lib/theming/Theme";
import { withThemeVars } from "../../../Themes/withThemeVars";
import { ThemeContext } from "@skbkontur/react-ui";
import classNames from "classnames/bind";

import styles from "../TagDropdownSelect.module.less";

const cn = classNames.bind(styles);

interface ITagInputProps {
    value: string[];
    inputValue: string;
    renderToken: (token: string) => React.ReactNode;
    onValueChange: (v: string) => void;
    onFocus: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    placeholder?: string;
    focused: boolean;
    error?: boolean;
    disabled?: boolean;
    dataTid?: string;
    useScrollContainer?: boolean;
    inputLineHeight?: string;
    minHeight?: string;
}

export const TagInput = forwardRef<HTMLInputElement, ITagInputProps>(
    (
        {
            value,
            inputValue,
            renderToken,
            onValueChange,
            onFocus,
            onKeyDown,
            placeholder,
            focused,
            error,
            disabled,
            dataTid,
            useScrollContainer = true,
            minHeight = "32px",
            inputLineHeight = "24px",
        },
        inputRef
    ) => {
        const theme = useContext<Theme>(ThemeContext);

        const content = (
            <div className={cn("content")}>
                {value.map((tag) => (
                    <div
                        className={cn("tag-wrap", { withoutScroll: !useScrollContainer })}
                        key={tag}
                    >
                        {renderToken(tag)}
                    </div>
                ))}
                <input
                    id="selector"
                    ref={inputRef}
                    className={cn("input")}
                    value={inputValue}
                    onKeyDown={onKeyDown}
                    onChange={(e) => onValueChange(e.target.value)}
                    onFocus={onFocus}
                    disabled={disabled}
                    placeholder={value.length === 0 ? placeholder : undefined}
                    data-tid={dataTid}
                    autoComplete="off"
                    style={{ lineHeight: inputLineHeight }}
                />
            </div>
        );

        return (
            <label
                style={{
                    ...withThemeVars(theme, [
                        "inputBorderColor",
                        "inputBorderColorHover",
                        "inputBorderColorFocus",
                        "inputBorderColorError",
                        "inputBg",
                        "inputDisabledBg",
                        "inputDisabledBorderColor",
                        "inputBorderWidth",
                        "inputBorderRadiusMedium",
                        "inputOutlineWidth",
                    ]),
                    minHeight,
                }}
                htmlFor="selector"
                className={cn("input-area", {
                    focused,
                    error,
                    "input-area-disabled": disabled,
                })}
            >
                {useScrollContainer ? (
                    <ScrollContainer className={cn("input-scroll-container")}>
                        {content}
                    </ScrollContainer>
                ) : (
                    content
                )}
            </label>
        );
    }
);
TagInput.displayName = "TagInput";
