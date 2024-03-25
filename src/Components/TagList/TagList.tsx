import React, { useRef, FC } from "react";
import { Contact } from "../../Domain/Contact";
import {
    MAX_LIST_LENGTH_BEFORE_SCROLLABLE,
    TAGS_LIST_HEIGHT,
    TAGS_LIST_ROW_HEIGHT,
    TagStat,
    getTotalItemSize,
} from "../../Domain/Tag";
import ArrowBoldDownIcon from "@skbkontur/react-icons/ArrowBoldDown";
import ArrowBoldUpIcon from "@skbkontur/react-icons/ArrowBoldUp";
import { useSortData } from "../../hooks/useSortData";
import { Subscription } from "../../Domain/Subscription";
import type { FixedSizeList } from "react-window";
import { FixedSizeList as List } from "react-window";
import { Input } from "@skbkontur/react-ui";
import { TagListItem } from "../TagListItem/TagListItem";
import classNames from "classnames/bind";

import styles from "./TagList.less";

const cn = classNames.bind(styles);

interface ITagListProps {
    items: Array<TagStat>;
    contacts: Array<Contact>;
    onRemoveTag: (tag: string) => void;
    onRemoveSubscription: (subscription: Subscription) => Promise<void>;
    onUpdateSubscription: (subscription: Subscription) => Promise<void>;
    onTestSubscription: (subscription: Subscription) => Promise<void>;
}

export const TagList: FC<ITagListProps> = ({
    items,
    contacts,
    onRemoveTag,
    onRemoveSubscription,
    onTestSubscription,
    onUpdateSubscription,
}) => {
    const { sortedData, sortConfig, handleSort } = useSortData(items, "name");

    const tags = items.map((item) => item.name);

    const listRef = useRef<FixedSizeList>(null);

    const sortingIcon =
        sortConfig.direction === "descending" ? <ArrowBoldDownIcon /> : <ArrowBoldUpIcon />;

    const scrollToRow = (row: string) => {
        if (Number.isNaN(Number(row))) return;
        listRef.current?.scrollToItem(Number(row));
    };

    const isListLongEnoughToScroll = items.length > MAX_LIST_LENGTH_BEFORE_SCROLLABLE;

    return (
        <div>
            {isListLongEnoughToScroll && (
                <Input placeholder="Scroll to row:" onValueChange={scrollToRow} />
            )}
            <div
                // Adjusting header width in dependance of list scroll bar
                style={{
                    width: isListLongEnoughToScroll ? "calc(100% - 16px)" : "100%",
                    marginTop: "20px",
                }}
                className={cn("row", "header")}
            >
                <div className={cn("name")}>
                    <button
                        onClick={() => handleSort("name")}
                        type="button"
                        className={cn("sorting-button")}
                    >
                        Tag {sortConfig.sortingColumn === "name" && sortingIcon}
                    </button>
                </div>
                <div className={cn("trigger-counter")}>
                    <button
                        onClick={() => handleSort("triggers")}
                        type="button"
                        className={cn("sorting-button")}
                    >
                        Triggers {sortConfig.sortingColumn === "triggers" && sortingIcon}
                    </button>
                </div>
                <div className={cn("subscription-counter")}>
                    <button
                        onClick={() => handleSort("subscriptions")}
                        type="button"
                        className={cn("sorting-button")}
                    >
                        Subscriptions {sortConfig.sortingColumn === "subscriptions" && sortingIcon}
                    </button>
                </div>
                <div className={cn("control")} />
            </div>
            <List
                ref={listRef}
                height={
                    isListLongEnoughToScroll ? TAGS_LIST_HEIGHT : getTotalItemSize(items.length)
                }
                width={"100%"}
                itemSize={TAGS_LIST_ROW_HEIGHT}
                itemCount={sortedData.length}
                itemData={sortedData}
            >
                {({ data, index, style }) => {
                    return (
                        <TagListItem
                            tagStat={data[index]}
                            style={style}
                            tags={tags}
                            allContacts={contacts}
                            onRemoveTag={onRemoveTag}
                            onUpdateSubscription={onUpdateSubscription}
                            onTestSubscription={onTestSubscription}
                            onRemoveSubscription={onRemoveSubscription}
                        />
                    );
                }}
            </List>
        </div>
    );
};
