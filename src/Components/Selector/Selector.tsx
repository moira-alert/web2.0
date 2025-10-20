import React, { useRef, useState } from "react";
import { TagDropdown } from "../TagDropdownSelect/Components/TagDropdown";
import { TagInput } from "../TagDropdownSelect/Components/TagInput";
import { RenderLayer } from "@skbkontur/react-ui/internal/RenderLayer";

type Props = {
    search: string;
    tokens: string[];
    renderToken: (token: string) => React.ReactNode;
    children: (closeDropdown: () => void) => React.ReactNode;
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
    const dropdownAnchorRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const openDropdown = () => {
        if (!focused) {
            setFocused(true);
        }
    };

    const closeDropdown = () => {
        if (focused) {
            searchInputRef.current?.blur();
            setFocused(false);
        }
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
        <RenderLayer onFocusOutside={closeDropdown} onClickOutside={closeDropdown} active={focused}>
            <div ref={dropdownAnchorRef}>
                <TagInput
                    focused={focused}
                    value={tokens}
                    inputValue={search}
                    renderToken={renderToken}
                    onValueChange={onInputChange}
                    onKeyDown={handleInputKeyDown}
                    onFocus={openDropdown}
                    useScrollContainer={false}
                    minHeight="40px"
                    inputLineHeight="32px"
                    ref={searchInputRef}
                />
                {focused && (
                    <TagDropdown anchor={dropdownAnchorRef.current}>
                        {children(closeDropdown)}
                    </TagDropdown>
                )}
            </div>
        </RenderLayer>
    );
};

export default Selector;
