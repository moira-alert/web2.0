import React, { useState, useRef, FocusEventHandler, useMemo } from "react";
import difference from "lodash/difference";
import union from "lodash/union";
import { RenderLayer } from "@skbkontur/react-ui/internal/RenderLayer";
import { TagInput } from "./Components/TagInput";
import { TagListDropdown } from "./Components/TagListDropdown";
import Tag from "../Tag/Tag";
import {
    handleBackspace,
    handleArrowUp,
    handleArrowDown,
    handleEnter,
} from "./Components/keyboardHandlers";

export type TagDropdownSelectProps = {
    value: string[];
    onChange: (tags: string[]) => void;
    availableTags: string[];
    error?: boolean;
    onBlur?: FocusEventHandler<HTMLDivElement>;
    isDisabled?: boolean;
    width?: string | number;
    allowCreateNewTags?: boolean;
    placeholder?: string;
    "data-tid"?: string;
};

const TagDropdownSelect: React.FC<TagDropdownSelectProps> = ({
    value,
    onChange,
    availableTags,
    error,
    onBlur,
    isDisabled,
    width,
    allowCreateNewTags,
    placeholder,
    "data-tid": dataTid,
}) => {
    const [inputValue, setInputValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(0);

    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const tagExists = (name: string) => availableTags.includes(name);

    const filteredTags = useMemo(
        () =>
            difference(availableTags, value).filter((t) =>
                t.toLowerCase().includes(inputValue.toLowerCase())
            ),
        [availableTags, value, inputValue]
    );

    const handleRemoveTag = (tag: string) => onChange(difference(value, [tag]));

    const selectTag = (tag: string) => {
        onChange(union(value, [tag]));
        setInputValue("");
        setFocusedIndex(0);
        inputRef.current?.focus();
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (!isFocused) return;
        const { key } = event;
        const caret = event.currentTarget.selectionStart ?? 0;

        switch (key) {
            case "Backspace":
                handleBackspace(caret, value, onChange);
                break;
            case "ArrowUp":
                handleArrowUp(setFocusedIndex, allowCreateNewTags, filteredTags.length);
                break;
            case "ArrowDown":
                handleArrowDown(
                    setFocusedIndex,
                    allowCreateNewTags,
                    filteredTags.length,
                    tagExists,
                    inputValue
                );
                break;
            case "Enter":
                handleEnter({
                    inputValue,
                    focusedIndex,
                    allowCreateNewTags,
                    tagExists,
                    filteredTags,
                    selectTag,
                    setInputValue,
                });
                break;
        }
    };

    const handleBlur = () => {
        setIsFocused(false);
    };

    const renderToken = (tag: string) => <Tag title={tag} onRemove={handleRemoveTag} />;

    return (
        <RenderLayer onClickOutside={handleBlur} onFocusOutside={handleBlur}>
            <div style={{ width }} ref={containerRef}>
                <TagInput
                    value={value}
                    inputValue={inputValue}
                    onValueChange={setInputValue}
                    onFocus={() => setIsFocused(true)}
                    onKeyDown={handleKeyDown}
                    renderToken={renderToken}
                    placeholder={placeholder}
                    focused={isFocused}
                    error={error}
                    disabled={isDisabled}
                    dataTid={dataTid}
                    ref={inputRef}
                />

                {isFocused && (
                    <TagListDropdown
                        anchor={containerRef.current}
                        tags={filteredTags}
                        focusedIndex={focusedIndex}
                        inputValue={inputValue}
                        allowCreateNewTags={allowCreateNewTags}
                        tagExists={tagExists}
                        selectTag={selectTag}
                        onBlur={onBlur}
                    />
                )}
            </div>
        </RenderLayer>
    );
};

export default TagDropdownSelect;
