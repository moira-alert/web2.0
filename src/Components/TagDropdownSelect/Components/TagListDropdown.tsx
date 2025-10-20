import React, { FocusEventHandler } from "react";
import Tag from "../../Tag/Tag";
import NewTagBadge from "../../NewTagBadge/NewTagBadge";
import { TagDropdown } from "./TagDropdown";

import styles from "../TagDropdownSelect.module.less";

interface ITagListDropdownProps {
    anchor: HTMLElement | null;
    tags: string[];
    focusedIndex: number;
    inputValue: string;
    allowCreateNewTags?: boolean;
    tagExists: (tag: string) => boolean;
    selectTag: (tag: string) => void;
    onBlur?: FocusEventHandler<HTMLDivElement>;
}

export const TagListDropdown: React.FC<ITagListDropdownProps> = ({
    anchor,
    tags,
    focusedIndex,
    inputValue,
    allowCreateNewTags,
    tagExists,
    selectTag,
    onBlur,
}) => {
    const trimmedInputValue = inputValue.trim();
    const showCreateOption =
        allowCreateNewTags && !tagExists(trimmedInputValue) && trimmedInputValue !== "";

    const allTagsSelected = tags.length === 0 && trimmedInputValue === "" && allowCreateNewTags;

    return (
        <TagDropdown anchor={anchor} onBlur={onBlur}>
            {allTagsSelected ? (
                <div className={styles["no-tags"]}>Type tag name to add new one</div>
            ) : tags.length > 0 || showCreateOption ? (
                <div className={styles["tag-list"]}>
                    {tags.map((tag, i) => (
                        <Tag
                            key={tag}
                            focus={i === focusedIndex - 1}
                            title={tag}
                            data-tid={`Tag ${tag}`}
                            onClick={() => selectTag(tag)}
                        />
                    ))}
                    {showCreateOption && (
                        <NewTagBadge
                            title={trimmedInputValue}
                            focus={focusedIndex === tags.length + 1}
                            onClick={() => selectTag(trimmedInputValue)}
                        />
                    )}
                </div>
            ) : (
                <div className={styles["no-tags"]}>No matched tags found.</div>
            )}
        </TagDropdown>
    );
};
