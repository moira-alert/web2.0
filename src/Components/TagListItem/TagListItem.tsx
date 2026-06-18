import { useState, FC, useEffect, useRef } from "react";
import * as React from "react";
import flatten from "lodash/flatten";
import { IconCheckARegular16 } from "@skbkontur/icons/IconCheckARegular16";
import { IconTrashCanLight16 } from "@skbkontur/icons/IconTrashCanLight16";
import { IconXRegular16 } from "@skbkontur/icons/IconXRegular16";
import ContactTypeIcon from "../ContactTypeIcon/ContactTypeIcon";
import { Contact } from "../../Domain/Contact";
import { TagStat } from "../../Domain/Tag";
import { useModal } from "../../hooks/useModal";
import SubscriptionEditModal from "../SubscriptionEditModal/SubscriptionEditModal";
import { Subscription } from "../../Domain/Subscription";
import { List } from "react-window";
import type { RowComponentProps } from "react-window";
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

interface SubscriptionRowProps {
    subscriptions: TagStat["subscriptions"];
    allContacts: Contact[];
    handleSubscriptionClick: (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>,
        subscription: Subscription
    ) => void;
    handleDeleteSubscription: (
        event: React.MouseEvent<SVGSVGElement, MouseEvent>,
        subscription: Subscription
    ) => void;
}

const SubscriptionRow = ({
    index,
    style,
    subscriptions,
    allContacts,
    handleSubscriptionClick,
    handleDeleteSubscription,
}: RowComponentProps<SubscriptionRowProps>) => {
    const subscription = subscriptions[index];

    const { enabled, user, team_id, contacts } = subscription;
    return (
        <div
            style={style}
            className={cn("item")}
            onClick={(event) => handleSubscriptionClick(event, subscription)}
        >
            <div className={cn("enabled")}>
                {enabled ? <IconCheckARegular16 /> : <IconXRegular16 />}
            </div>
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
            <IconTrashCanLight16
                className={cn("sub-control")}
                onClick={(event) => handleDeleteSubscription(event, subscription)}
            />
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
        event: React.MouseEvent<SVGSVGElement, MouseEvent>,
        subscription: Subscription
    ) => {
        event.stopPropagation();
        await deleteSubscription({ id: subscription.id, tagsToInvalidate: ["TagStats"] });
    };

    const handleDeleteTag = async (
        event: React.MouseEvent<SVGSVGElement, MouseEvent>,
        tag: string
    ) => {
        event.stopPropagation();
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

            <IconTrashCanLight16
                className={cn("control")}
                onClick={(e) => handleDeleteTag(e, tagStat.name)}
            />

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
                            style={{ height: getSubscriptionsTableHeight, width: "100%" }}
                            rowComponent={SubscriptionRow}
                            rowCount={subscriptions.length}
                            rowHeight={(index) =>
                                getSubscriptionRowHeight(subscriptions[index].contacts)
                            }
                            rowProps={{
                                subscriptions,
                                allContacts,
                                handleSubscriptionClick,
                                handleDeleteSubscription,
                            }}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};
