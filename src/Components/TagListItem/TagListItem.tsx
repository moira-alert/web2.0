import React, { useState, FC } from "react";
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
import {
    MAX_LIST_LENGTH_BEFORE_SCROLLABLE,
    SUBSCRIPTION_LIST_HEIGHT,
    getTotalItemSize,
    TAGS_LIST_ROW_HEIGHT,
} from "../TagList/TagList";
import classNames from "classnames/bind";

import styles from "../TagList/TagList.less";

const cn = classNames.bind(styles);

interface ItemProps {
    tagStat: TagStat;
    allContacts: Array<Contact>;
    tags: Array<string>;
    style: React.CSSProperties;
    onRemoveTag: (tag: string) => void;
    onRemoveSubscription: (subscription: Subscription) => Promise<void>;
    onUpdateSubscription: (subscription: Subscription) => Promise<void>;
    onTestSubscription: (subscription: Subscription) => Promise<void>;
}

export const getSubscriptionRowHeight = (contactIDs: string[]) => {
    if (contactIDs.length > 1) {
        return getTotalItemSize(contactIDs.length);
    }

    return TAGS_LIST_ROW_HEIGHT;
};

export const TagListItem: FC<ItemProps> = ({
    tagStat,
    allContacts,
    tags,
    style,
    onRemoveTag,
    onRemoveSubscription,
    onTestSubscription,
    onUpdateSubscription,
}) => {
    const [isInfoVisible, setIsInfoVisible] = useState(false);
    const [subscriptionToEdit, setSubscriptionToEdit] = useState<Subscription | null>(null);
    const { isModalOpen, openModal, closeModal } = useModal();
    const { name, subscriptions, triggers } = tagStat;

    const hasSubscriptions = subscriptions.length !== 0;

    const handleItemClick = () => {
        setIsInfoVisible(!isInfoVisible);
    };

    const handleSubscriptionClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        subscription: Subscription
    ) => {
        event.stopPropagation();
        setSubscriptionToEdit(subscription);
        openModal();
    };

    const handleDeleteSubscription = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        subscription: Subscription
    ) => {
        event.stopPropagation();
        onRemoveSubscription(subscription);
    };

    const subscriptionContactsCount = flatten(
        subscriptions.map((subscription) => subscription.contacts)
    ).length;

    const getSubscriptionsTableHeight =
        subscriptionContactsCount > MAX_LIST_LENGTH_BEFORE_SCROLLABLE
            ? SUBSCRIPTION_LIST_HEIGHT
            : getTotalItemSize(subscriptionContactsCount);

    return (
        <div
            style={style}
            className={cn("row", { active: isInfoVisible, clickable: hasSubscriptions })}
            onClick={handleItemClick}
        >
            <div className={cn("name")}>{name}</div>
            <div className={cn("trigger-counter")}>{triggers.length}</div>
            <div className={cn("subscription-counter")}>{subscriptions.length}</div>
            <div className={cn("control")}>
                <Button use="link" icon={<TrashIcon />} onClick={() => onRemoveTag(tagStat.name)}>
                    Delete
                </Button>
            </div>
            {isModalOpen && subscriptionToEdit !== null && (
                <SubscriptionEditModal
                    subscription={subscriptionToEdit}
                    tags={tags}
                    contacts={allContacts}
                    onChange={(update) =>
                        setSubscriptionToEdit({ ...subscriptionToEdit, ...update })
                    }
                    onCancel={closeModal}
                    onUpdateSubscription={onUpdateSubscription}
                    onUpdateAndTestSubscription={onTestSubscription}
                    onRemoveSubscription={onRemoveSubscription}
                />
            )}
            {isInfoVisible && (
                <div className={cn("info")}>
                    {hasSubscriptions && (
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
                                        <div
                                            style={style}
                                            key={id}
                                            className={cn("item")}
                                            onClick={(event) =>
                                                handleSubscriptionClick(event, data[index])
                                            }
                                        >
                                            <div className={cn("enabled")}>
                                                {enabled ? <OkIcon /> : <DeleteIcon />}
                                            </div>
                                            <div className={cn("user")}>
                                                {user !== "" ? user : `teamID: ${team_id}`}
                                            </div>
                                            <div className={cn("contacts")}>
                                                {contacts.map((contactId) => {
                                                    const contact = allContacts.find(
                                                        (contact) => contact.id === contactId
                                                    );
                                                    if (contact) {
                                                        return (
                                                            <div key={contact.id}>
                                                                <ContactTypeIcon
                                                                    type={contact.type}
                                                                />
                                                                &nbsp;
                                                                {contact.value}
                                                            </div>
                                                        );
                                                    }
                                                    return null;
                                                })}
                                            </div>
                                            <div className={cn("sub-control")}>
                                                <Button
                                                    use="link"
                                                    icon={<TrashIcon />}
                                                    onClick={(event) =>
                                                        handleDeleteSubscription(event, data[index])
                                                    }
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                }}
                            </List>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
