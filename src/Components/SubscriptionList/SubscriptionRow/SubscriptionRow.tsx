import React, { useState } from "react";
import { Link, Hint } from "@skbkontur/react-ui";
import { Contact, filterSubscriptionContacts } from "../../../Domain/Contact";
import { Subscription } from "../../../Domain/Subscription";
import ContactInfo from "../../ContactInfo/ContactInfo";
import TagGroup from "../../TagGroup/TagGroup";
import HelpTooltip from "../../HelpTooltip/HelpTooltip";
import queryString from "query-string";
import ArrowChevronUpIcon from "@skbkontur/react-icons/ArrowChevronUp";
import ArrowChevronDownIcon from "@skbkontur/react-icons/ArrowChevronDown";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { UIState } from "../../../store/selectors";
import { Checkbox } from "@skbkontur/react-ui/components/Checkbox";
import { toggleManagingSubscriptions } from "../../../store/Reducers/UIReducer.slice";
import classNames from "classnames/bind";

import styles from "./SubscriptionRow.less";

const cn = classNames.bind(styles);

interface SubscriptionRowProps {
    subscription: Subscription;
    contacts: Contact[];
    onEditSubscription: (subscription: Subscription) => void;
}

export const SubscriptionRow: React.FC<SubscriptionRowProps> = ({
    subscription,
    contacts,
    onEditSubscription,
}) => {
    const {
        isTransferringSubscriptions,
        managingSubscriptions,
        isEnablingSubscriptions,
    } = useAppSelector(UIState);
    const dispatch = useAppDispatch();
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const getSubscriptionContacts = filterSubscriptionContacts(
        contacts,
        subscription
    ).map((x: Contact) => <ContactInfo className={cn("contact")} key={x.id} contact={x} />);

    const areAnyDisruptedSubs = getSubscriptionContacts.length === 0;

    const triggersPageParams = `/?${queryString.stringify(
        { tags: subscription.tags },
        {
            arrayFormat: "index",
        }
    )}`;

    const handleCollapse = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        toggleExpand();
        event.stopPropagation();
    };

    const rowClassName = cn(
        {
            error: areAnyDisruptedSubs,
            expanded: isExpanded,
        },
        "item"
    );

    return (
        <tr
            key={subscription.id}
            className={cn(rowClassName)}
            onClick={() => onEditSubscription(subscription)}
        >
            {(isTransferringSubscriptions || isEnablingSubscriptions) && (
                <td
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                    className={cn("checkbox-cell")}
                >
                    <Checkbox
                        className={cn({
                            focused:
                                (isTransferringSubscriptions || isEnablingSubscriptions) &&
                                !managingSubscriptions.length,
                        })}
                        checked={managingSubscriptions.includes(subscription)}
                        onClick={() => {
                            dispatch(toggleManagingSubscriptions(subscription));
                        }}
                    />
                </td>
            )}
            <td className={cn("showMore-button-cell")}>
                {isExpanded ? (
                    <ArrowChevronUpIcon onClick={(event) => handleCollapse(event)} />
                ) : (
                    <ArrowChevronDownIcon onClick={(event) => handleCollapse(event)} />
                )}
            </td>
            <td className={cn("tags-cell")}>
                <div className={cn("tags-content")}>
                    <TagGroup tags={subscription.tags} />
                </div>
            </td>
            <td className={cn("triggers-cell")}>
                <Hint text="Show all associated triggers">
                    <Link
                        target="_blank"
                        href={triggersPageParams}
                        onClick={(e) => e.stopPropagation()}
                    >
                        Show triggers
                    </Link>
                </Hint>
            </td>
            <td className={cn("contacts-cell")}>
                <div className={cn("contacts-content")}>{getSubscriptionContacts}</div>
            </td>
            {!subscription.enabled && (
                <td className={cn("enabled-cell")}>
                    <span className={cn("disabled-label")}>Disabled</span>
                </td>
            )}
            {areAnyDisruptedSubs && (
                <td className={cn("tooltip-cell")}>
                    <HelpTooltip trigger="hover">
                        It seems that this subscription is broken, please set up the delivery
                        channel.
                    </HelpTooltip>
                </td>
            )}
        </tr>
    );
};
