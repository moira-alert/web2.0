import React, { useState, useRef, FocusEventHandler, useMemo } from "react";
import difference from "lodash/difference";
import union from "lodash/union";
import { RenderLayer } from "@skbkontur/react-ui/internal/RenderLayer";
import { TagInput } from "./Components/TagInput";
import { TagListDropdown } from "./Components/TagListDropdown";
import Tag from "../Tag/Tag";

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
        const { key } = event;
        const caret = event.currentTarget.selectionStart ?? 0;
        if (!isFocused) return;

        switch (key) {
            case "Backspace":
                if (caret === 0 && value.length) {
                    handleRemoveTag(value[value.length - 1]);
                }
                break;
            case "ArrowUp":
                setFocusedIndex((prev) =>
                    prev > 0
                        ? prev - 1
                        : allowCreateNewTags
                        ? filteredTags.length + 1
                        : filteredTags.length
                );
                break;
            case "ArrowDown":
                setFocusedIndex((prev) =>
                    allowCreateNewTags && !tagExists(inputValue)
                        ? prev < filteredTags.length + 1
                            ? prev + 1
                            : 0
                        : prev < filteredTags.length
                        ? prev + 1
                        : 0
                );
                break;
            case "Enter":
                if (focusedIndex !== 0) {
                    if (inputValue.trim() === "") break;
                    if (
                        allowCreateNewTags &&
                        !tagExists(inputValue) &&
                        focusedIndex === filteredTags.length + 1
                    ) {
                        selectTag(inputValue.trim());
                    } else {
                        selectTag(filteredTags[focusedIndex - 1]);
                    }
                } else {
                    if (inputValue.trim() === "") break;
                    if (allowCreateNewTags && !tagExists(inputValue)) {
                        selectTag(inputValue.trim());
                    } else if (filteredTags.length) {
                        selectTag(filteredTags[filteredTags.length - 1]);
                    }
                }
                setInputValue("");
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
