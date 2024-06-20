import React, { FC, useState } from "react";
import { Contact } from "../../Domain/Contact";
import { TagStat } from "../../Domain/Tag";
import ArrowBoldDownIcon from "@skbkontur/react-icons/ArrowBoldDown";
import ArrowBoldUpIcon from "@skbkontur/react-icons/ArrowBoldUp";
import { useSortData } from "../../hooks/useSortData";
import { Subscription } from "../../Domain/Subscription";
import { FixedSizeList as List } from "react-window";
import { TagListItem } from "../TagListItem/TagListItem";
import { Input, Token } from "@skbkontur/react-ui";
import { TokenInput, TokenInputType } from "@skbkontur/react-ui/components/TokenInput";
import { RowStack } from "@skbkontur/react-stack-layout";
import classNames from "classnames/bind";

import styles from "./TagList.less";

const cn = classNames.bind(styles);

interface ITagListProps {
    items: Array<TagStat>;
    contacts: Contact[];
    onRemoveTag: (tag: string) => void;
    onRemoveSubscription: (subscription: Subscription) => Promise<void>;
}

export const MAX_LIST_LENGTH_BEFORE_SCROLLABLE = 40;
export const LIST_HEIGHT = 1000;
export const SUBSCRIPTION_LIST_HEIGHT = 500;
export const ROW_HEIGHT = 25;

export const getTotalItemSize = (length: number) => length * ROW_HEIGHT + 1;

export const TagList: FC<ITagListProps> = ({
    items,
    contacts,
    onRemoveTag,
    onRemoveSubscription,
}) => {
    const { sortedData, sortConfig, handleSort } = useSortData(items, "name");
    const [filterTagName, setfilterTagName] = useState<string>("");
    const [filterContacts, setfilterContacts] = useState<Contact[]>([]);

    const tags = items.map((item) => item.name);

    const SortingIcon =
        sortConfig.direction === "desc" ? <ArrowBoldDownIcon /> : <ArrowBoldUpIcon />;

    const filteredTags = sortedData.filter((tag) => {
        const tagNameMatches = filterTagName.length
            ? tag.name.toLowerCase().includes(filterTagName.toLowerCase().trim())
            : true;

        const contactsMatch = filterContacts.length
            ? filterContacts.every((filterContact) =>
                  tag.subscriptions.flatMap((sub) => sub.contacts).includes(filterContact.id)
              )
            : true;

        return tagNameMatches && contactsMatch;
    });

    const isListLongEnoughToScroll = filteredTags.length > MAX_LIST_LENGTH_BEFORE_SCROLLABLE;

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
                        <Token key={contact.value.toString()} {...tokenProps}>
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
                            isListLongEnoughToScroll ? LIST_HEIGHT : getTotalItemSize(items.length)
                        }
                        width="100%"
                        itemSize={ROW_HEIGHT}
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
                                    onRemoveTag={onRemoveTag}
                                    onRemoveSubscription={onRemoveSubscription}
                                />
                            );
                        }}
                    </List>
                </>
            )}
        </>
    );
};
