import React, { FC, useState, useMemo } from "react";
import { Contact } from "../../Domain/Contact";
import { TagStat } from "../../Domain/Tag";
import ArrowBoldDownIcon from "@skbkontur/react-icons/ArrowBoldDown";
import ArrowBoldUpIcon from "@skbkontur/react-icons/ArrowBoldUp";
import { useSortData } from "../../hooks/useSortData";
import { FixedSizeList as List } from "react-window";
import { TagListItem } from "../TagListItem/TagListItem";
import { Input, Token } from "@skbkontur/react-ui";
import { TokenInput, TokenInputType } from "@skbkontur/react-ui/components/TokenInput";
import { RowStack } from "@skbkontur/react-stack-layout";
import {
    MAX_TAG_LIST_LENGTH_BEFORE_SCROLLABLE,
    TAG_LIST_HEIGHT,
    TAG_ROW_HEIGHT,
} from "../../helpers/constants";
import classNames from "classnames/bind";

import styles from "./TagList.less";

const cn = classNames.bind(styles);

interface ITagListProps {
    items: Array<TagStat>;
    contacts: Contact[];
}

export const getTotalItemSize = (length: number) => length * TAG_ROW_HEIGHT + 1;

export const TagList: FC<ITagListProps> = ({ items, contacts }) => {
    const { sortedData, sortConfig, handleSort } = useSortData(items, "name");
    const [filterTagName, setfilterTagName] = useState<string>("");
    const [filterContacts, setfilterContacts] = useState<Contact[]>([]);
    const [clickedTag, setClickedTag] = useState<string | null>(null);

    const tags = items.map((item) => item.name);

    const SortingIcon =
        sortConfig.direction === "desc" ? <ArrowBoldDownIcon /> : <ArrowBoldUpIcon />;

    const handleTagClick = (tagName: string) => {
        tagName === clickedTag ? setClickedTag(null) : setClickedTag(tagName);
    };

    const filteredTags = useMemo(
        () =>
            sortedData.filter((tag) => {
                const tagNameMatches = filterTagName.length
                    ? tag.name.toLowerCase().includes(filterTagName.toLowerCase().trim())
                    : true;

                const contactsMatch = filterContacts.length
                    ? filterContacts.every((filterContact) =>
                          tag.subscriptions
                              .flatMap((sub) => sub.contacts)
                              .includes(filterContact.id)
                      )
                    : true;

                return tagNameMatches && contactsMatch;
            }),
        [sortedData, filterContacts, filterTagName]
    );

    const isListLongEnoughToScroll = filteredTags.length > MAX_TAG_LIST_LENGTH_BEFORE_SCROLLABLE;

    const getContatcs = (query: string): Promise<Contact[]> => {
        if (!contacts) {
            return Promise.resolve([]);
        }
        return Promise.resolve(
            contacts
                .filter(
                    (contact: Contact) =>
                        contact.value.toLowerCase().includes(query.toLowerCase().trim()) ||
                        contact.name?.toLowerCase().includes(query.toLowerCase().trim())
                )
                .slice(0, 10)
        );
    };

    return (
        <>
            <RowStack gap={2} block baseline>
                <Input placeholder="Find tag" onValueChange={setfilterTagName} />
                <TokenInput<Contact>
                    width={"100%"}
                    className={cn("contact-filter")}
                    placeholder="Filter by contact"
                    type={TokenInputType.Combined}
                    getItems={getContatcs}
                    renderAddButton={() => null}
                    renderItem={(contact) => (
                        <>
                            {contact.value} {contact.name && `(${contact.name})`}
                        </>
                    )}
                    valueToString={(item) => item.name || item.value}
                    selectedItems={filterContacts}
                    totalCount={contacts?.length}
                    renderTotalCount={(found, total) =>
                        found < total && found !== 0
                            ? `${found} from ${total} contacts are shown.`
                            : null
                    }
                    onValueChange={setfilterContacts}
                    renderNotFound={() => "No delivery channels found"}
                    renderToken={(contact, tokenProps) => (
                        <Token key={contact.value} {...tokenProps}>
                            <>
                                {contact.value} {contact.name && `(${contact.name})`}
                            </>
                        </Token>
                    )}
                />
            </RowStack>

            {!filteredTags.length || !items.length ? (
                <div className={cn("empty-result")}>No tags found</div>
            ) : (
                <>
                    <div
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
                                Tag {sortConfig.sortingColumn === "name" && SortingIcon}
                            </button>
                        </div>
                        <div className={cn("trigger-counter")}>
                            <button
                                onClick={() => handleSort("triggers")}
                                type="button"
                                className={cn("sorting-button")}
                            >
                                Triggers {sortConfig.sortingColumn === "triggers" && SortingIcon}
                            </button>
                        </div>
                        <div className={cn("subscription-counter")}>
                            <button
                                onClick={() => handleSort("subscriptions")}
                                type="button"
                                className={cn("sorting-button")}
                            >
                                Subscriptions{" "}
                                {sortConfig.sortingColumn === "subscriptions" && SortingIcon}
                            </button>
                        </div>
                        <div className={cn("control")} />
                    </div>
                    <List
                        height={
                            isListLongEnoughToScroll
                                ? TAG_LIST_HEIGHT
                                : getTotalItemSize(items.length)
                        }
                        width="100%"
                        itemSize={TAG_ROW_HEIGHT}
                        itemCount={filteredTags.length}
                        itemData={filteredTags}
                    >
                        {({ data, index, style }) => {
                            return (
                                <TagListItem
                                    tagStat={data[index]}
                                    style={style}
                                    tags={tags}
                                    allContacts={contacts ?? []}
                                    handleTagClick={handleTagClick}
                                    isActive={clickedTag === data[index].name}
                                />
                            );
                        }}
                    </List>
                </>
            )}
        </>
    );
};
