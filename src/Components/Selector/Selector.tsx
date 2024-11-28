import React, { useRef, useState, useCallback } from "react";
import ReactDOM from "react-dom";
import Foco from "react-foco";
import { useTheme } from "../../shared/themes";
import classNames from "classnames/bind";

import styles from "./Selector.less";

const cn = classNames.bind(styles);

const Portal = ({ children }: { children: React.ReactNode }) => {
    const container = document.body;

    if (!container) {
        throw new Error("Container for portal is empty");
    }

    return ReactDOM.createPortal(children, container);
};

const Dropdown = ({
    anchor,
    children,
}: {
    anchor?: HTMLLabelElement | null;
    children: React.ReactNode;
}) => {
    const SELECTOR_OUTLINE_SIZE = 1;

    if (!anchor) {
        throw new Error("Anchor in Dropdown component is empty");
    }

    const {
        top: anchorTop,
        left: anchorLeft,
        height: anchorHeight,
        width,
    } = anchor.getBoundingClientRect();

    const top = anchorTop + anchorHeight + SELECTOR_OUTLINE_SIZE + window.pageYOffset;
    const left = anchorLeft + window.pageXOffset;
    const theme = useTheme();

    return (
        <Portal>
            <div
                className={cn("dropdown")}
                style={{ top, left, width, borderColor: theme.inputBorderColor }}
            >
                {children}
            </div>
        </Portal>
    );
};

type Props = {
    search: string;
    tokens: string[];
    renderToken: (token: string) => React.ReactNode;
    children: React.ReactNode;
    onEnterKeyDown: () => void;
    onBackspaceKeyDown: () => void;
    onInputChange: (value: string) => void;
};

const Selector: React.FC<Props> = ({
    search,
    tokens,
    renderToken,
    children,
    onEnterKeyDown,
    onBackspaceKeyDown,
    onInputChange,
}) => {
    const [focused, setFocused] = useState(false);
    const dropdownAnchorRef = useRef<HTMLLabelElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const theme = useTheme();

    const openDropdown = useCallback(() => {
        if (!focused) {
            setFocused(true);
        }
    }, [focused]);

    const closeDropdown = useCallback(() => {
        if (focused) {
            searchInputRef.current?.blur();
            setFocused(false);
        }
    }, [focused]);

    const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        onInputChange(evt.currentTarget.value);
    };

    const handleInputKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
        if (evt.key === "Enter") {
            onEnterKeyDown();
            closeDropdown();
        }

        if (
            evt.key === "Backspace" &&
            evt.currentTarget.selectionStart === 0 &&
            tokens.length !== 0
        ) {
            onBackspaceKeyDown();
        }
    };

    return (
        <Foco className={cn("wrapper")} onClickOutside={closeDropdown}>
            <label
                className={cn({ selector: true, focused })}
                htmlFor="selector"
                ref={dropdownAnchorRef}
                style={{ backgroundColor: theme.inputBg, borderColor: theme.inputBorderColor }}
            >
                <React.Profiler id="tokens" onRender={() => console.log("tokens rerendered")}>
                    {tokens.map((token) => (
                        <span key={token} className={cn("token-container")}>
                            {renderToken(token)}
                        </span>
                    ))}
                </React.Profiler>
                <input
                    style={{
                        backgroundColor: theme.inputBg,
                        color: theme.textColorDefault,
                        borderColor: theme.inputBorderColor,
                    }}
                    className={cn("input")}
                    id="selector"
                    type="text"
                    value={search}
                    autoComplete="off"
                    ref={searchInputRef}
                    onChange={handleInputChange}
                    onKeyDown={handleInputKeyDown}
                    onFocus={openDropdown}
                />
            </label>
            {focused && <Dropdown anchor={dropdownAnchorRef.current}>{children}</Dropdown>}
        </Foco>
    );
};

export default Selector;
