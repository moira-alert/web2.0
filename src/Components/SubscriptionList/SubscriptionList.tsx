import React from "react";
import { Gapped } from "@skbkontur/react-ui";
import { Contact } from "../../Domain/Contact";
import { Subscription } from "../../Domain/Subscription";
import TagGroup from "../TagGroup/TagGroup";
import { notUndefined } from "../../helpers/common";
import ContactInfo from "../ContactInfo/ContactInfo";
import HelpTooltip from "../HelpTooltip/HelpTooltip";

import cn from "./SubscriptionList.less";

interface Props {
    tableRef?: React.Ref<HTMLTableElement>;
    subscriptions: Subscription[];
    contacts: Contact[];
    handleEditSubscription: (subscription: Subscription) => void;
}

export const SubscriptionsList: React.FC<Props> = ({
    tableRef,
    subscriptions,
    contacts,
    handleEditSubscription,
}) => {
    const renderSubscriptionRow = (
        subscription: Subscription,
        contacts: Contact[],
        handleEditSubscription: (subscription: Subscription) => void
    ): React.ReactElement => {
        const subscriptionContacts = subscription.contacts
            .map((x) => contacts.find((y) => y.id === x))
            .filter(notUndefined)
            .map((x: Contact) => <ContactInfo key={x.id} contact={x} />);

        const checkDisruptSubscriptions = subscriptionContacts.length === 0;

        return (
            <tr
                key={subscription.id}
                className={cn("item", { error: checkDisruptSubscriptions })}
                onClick={() => handleEditSubscription(subscription)}
            >
                <td className={cn("tags-cell")}>
                    <TagGroup tags={subscription.tags} />
                </td>
                <td className={cn("contacts-cell")}>
                    <Gapped gap={10}>{subscriptionContacts}</Gapped>
                </td>
                <td className={cn("enabled-cell")}>
                    {!subscription.enabled && (
                        <span className={cn("disabled-label")}>Disabled</span>
                    )}
                </td>
                {checkDisruptSubscriptions && (
                    <td>
                        <HelpTooltip trigger="hover">
                            It seems that this subscription is broken, please set up the delivery
                            channel.
                        </HelpTooltip>
                    </td>
                )}
            </tr>
        );
    };

    return (
        <div className={cn("items-container")}>
            <table ref={tableRef} className={cn("items")}>
                <tbody>
                    {subscriptions.map((subscription) =>
                        renderSubscriptionRow(subscription, contacts, handleEditSubscription)
                    )}
                </tbody>
            </table>
        </div>
    );
};
