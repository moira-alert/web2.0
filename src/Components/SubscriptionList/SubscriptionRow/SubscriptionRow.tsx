import React from "react";
import { Link, Gapped, Hint } from "@skbkontur/react-ui";
import { Contact, filterSubscriptionContacts } from "../../../Domain/Contact";
import { Subscription } from "../../../Domain/Subscription";
import ContactInfo from "../../ContactInfo/ContactInfo";
import TagGroup from "../../TagGroup/TagGroup";
import HelpTooltip from "../../HelpTooltip/HelpTooltip";
import queryString from "query-string";
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
    const getSubscriptionContacts = filterSubscriptionContacts(
        contacts,
        subscription
    ).map((x: Contact) => <ContactInfo key={x.id} contact={x} />);

    const areAnyDisruptedSubs = getSubscriptionContacts.length === 0;

    const triggersPageParams = `/?${queryString.stringify(
        { tags: subscription.tags },
        {
            arrayFormat: "index",
        }
    )}`;

    return (
        <tr
            key={subscription.id}
            className={cn("item", { error: areAnyDisruptedSubs })}
            onClick={() => onEditSubscription(subscription)}
        >
            <td className={cn("tags-cell")}>
                <TagGroup tags={subscription.tags} />
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
                <Gapped gap={10}>{getSubscriptionContacts}</Gapped>
            </td>
            <td className={cn("enabled-cell")}>
                {!subscription.enabled && <span className={cn("disabled-label")}>Disabled</span>}
            </td>
            <td className={cn("tooltip-cell")}>
                {areAnyDisruptedSubs && (
                    <HelpTooltip trigger="hover">
                        It seems that this subscription is broken, please set up the delivery
                        channel.
                    </HelpTooltip>
                )}
            </td>
        </tr>
    );
};
