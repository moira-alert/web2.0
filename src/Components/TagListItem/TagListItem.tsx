import React, { useState, FC, useEffect, useRef } from "react";
import flatten from "lodash/flatten";
import { Button } from "@skbkontur/react-ui/components/Button";
import OkIcon from "@skbkontur/react-icons/Ok";
import DeleteIcon from "@skbkontur/react-icons/Delete";
import TrashIcon from "@skbkontur/react-icons/Trash";
import ContactTypeIcon from "../ContactTypeIcon/ContactTypeIcon";
import { Contact } from "../../Domain/Contact";
import { TagStat } from "../../Domain/Tag";
import { useModal } from "../../hooks/useModal";
import SubscriptionEditModal from "../SubscriptionEditModal/SubscriptionEditModal";
import { Subscription } from "../../Domain/Subscription";
import { VariableSizeList as List } from "react-window";
import { useDeleteSubscriptionMutation } from "../../services/SubscriptionsApi";
import { useDeleteTagMutation } from "../../services/TagsApi";
import RouterLink from "../RouterLink/RouterLink";
import { getPageLink } from "../../Domain/Global";
import {
    MAX_TAG_LIST_LENGTH_BEFORE_SCROLLABLE,
    SUBSCRIPTION_LIST_HEIGHT,
    TAG_ROW_HEIGHT,
} from "../../Constants/heights";
import { getTotalItemSize } from "../TagList/TagList";
import classNames from "classnames/bind";

import styles from "../TagList/TagList.module.less";

const cn = classNames.bind(styles);

interface ItemProps {
    tagStat: TagStat;
    allContacts: Array<Contact>;
    tags: Array<string>;
    style: React.CSSProperties;
    handleTagClick: (tag: string) => void;
    isActive?: boolean;
}

export const getSubscriptionRowHeight = (contactIDs: string[]) => {
    if (contactIDs.length > 1) {
        return getTotalItemSize(contactIDs.length);
    }

    return TAG_ROW_HEIGHT;
};

interface SubscriptionItemProps {
    subscription: {
        enabled: boolean;
        user: string;
        team_id?: string;
        contacts: string[];
    };
    allContacts: Contact[];
    style: React.CSSProperties;
    onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
    onDelete: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

const SubscriptionItem: FC<SubscriptionItemProps> = ({
    subscription,
    allContacts,
    style,
    onClick,
    onDelete,
}) => {
    const { enabled, user, team_id, contacts } = subscription;

    return (
        <div style={style} className={cn("item")} onClick={onClick}>
            <div className={cn("enabled")}>{enabled ? <OkIcon /> : <DeleteIcon />}</div>
            <div className={cn("user")}>
                {user ? (
                    user
                ) : (
                    <span>
                        teamID:&nbsp;
                        <span onClick={(e) => e.stopPropagation()}>
                            <RouterLink to={getPageLink("teamSettings", team_id!)}>
                                {team_id}
                            </RouterLink>
                        </span>
                    </span>
                )}
            </div>
            <div className={cn("contacts")}>
                {contacts.map((contactId) => {
                    const contact = allContacts.find((contact) => contact.id === contactId);
                    if (contact) {
                        return (
                            <div key={contact.id}>
                                <ContactTypeIcon type={contact.type} />
                                &nbsp;
                                {contact.value}
                                &nbsp;
                                {contact.name && `(${contact.name})`}
                            </div>
                        );
                    }
                    return null;
                })}
            </div>
            <div className={cn("sub-control")}>
                <Button use="link" icon={<TrashIcon />} onClick={onDelete}>
                    Delete
                </Button>
            </div>
        </div>
    );
};

export const TagListItem: FC<ItemProps> = ({
    tagStat,
    allContacts,
    tags,
    style,
    handleTagClick,
    isActive,
}) => {
    const [subscriptionToEdit, setSubscriptionToEdit] = useState<Subscription | null>(null);
    const { isModalOpen, openModal, closeModal } = useModal();
    const [deleteSubscription] = useDeleteSubscriptionMutation();
    const [deleteTag] = useDeleteTagMutation();
    const { name, subscriptions, triggers } = tagStat;

    const itemRef = useRef<HTMLDivElement | null>(null);

    const isLastTag = tags[tags.length - 1] === name;

    const hasSubscriptions = subscriptions.length !== 0;

    const handleSubscriptionClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        subscription: Subscription
    ) => {
        event.stopPropagation();
        setSubscriptionToEdit(subscription);
        openModal();
    };

    const handleDeleteSubscription = async (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        subscription: Subscription
    ) => {
        event.stopPropagation();
        await deleteSubscription({ id: subscription.id, tagsToInvalidate: ["TagStats"] });
    };

    const handleDeleteTag = async (tag: string) => {
        await deleteTag(tag);
    };

    const subscriptionContactsCount = flatten(
        subscriptions.map((subscription) => subscription.contacts)
    ).length;

    const getSubscriptionsTableHeight =
        subscriptionContactsCount > MAX_TAG_LIST_LENGTH_BEFORE_SCROLLABLE
            ? SUBSCRIPTION_LIST_HEIGHT
            : getTotalItemSize(subscriptionContactsCount);

    // if last tag in the list has subs, open the subs list and scroll to the center, cause on Mac OS there is now visual difference and scroll bar only shows up when explicitly move mouse on the list
    useEffect(() => {
        if (isActive && isLastTag && hasSubscriptions && itemRef.current) {
            itemRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }
    }, [isActive]);

    return (
        <div
            ref={itemRef}
            style={style}
            className={cn("row", {
                active: isActive && hasSubscriptions,
                clickable: hasSubscriptions,
            })}
            onClick={() => handleTagClick(name)}
        >
            <div className={cn("name")}>{name}</div>
            <div className={cn("trigger-counter")}>{triggers.length}</div>
            <div className={cn("subscription-counter")}>{subscriptions.length}</div>
            <div className={cn("control")}>
                <Button
                    use="link"
                    icon={<TrashIcon />}
                    onClick={() => handleDeleteTag(tagStat.name)}
                >
                    Delete
                </Button>
            </div>
            {isModalOpen && subscriptionToEdit !== null && (
                <SubscriptionEditModal
                    subscription={subscriptionToEdit}
                    tags={tags}
                    contacts={allContacts}
                    onCancel={closeModal}
                />
            )}
            {isActive && hasSubscriptions && (
                <div className={cn("info")}>
                    <div className={cn("group")}>
                        <List
                            height={getSubscriptionsTableHeight}
                            width={"100%"}
                            itemSize={(index) =>
                                getSubscriptionRowHeight(subscriptions[index].contacts)
                            }
                            itemCount={subscriptions.length}
                            itemData={subscriptions}
                        >
                            {({ data, index, style }) => {
                                const { id, enabled, user, team_id, contacts } = data[index];
                                return (
                                    <SubscriptionItem
                                        key={id}
                                        style={style}
                                        subscription={{ enabled, user, team_id, contacts }}
                                        allContacts={allContacts}
                                        onClick={(event) =>
                                            handleSubscriptionClick(event, data[index])
                                        }
                                        onDelete={(event) =>
                                            handleDeleteSubscription(event, data[index])
                                        }
                                    />
                                );
                            }}
                        </List>
                    </div>
                </div>
            )}
        </div>
    );
};
