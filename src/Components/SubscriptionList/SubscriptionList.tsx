import React from "react";
import { Contact } from "../../Domain/Contact";
import { Subscription } from "../../Domain/Subscription";
import { SubscriptionRow } from "./SubscriptionRow/SubscriptionRow";

import classNames from "classnames/bind";

import styles from "./SubscriptionList.less";

const cn = classNames.bind(styles);

interface Props {
    tableRef?: React.Ref<HTMLTableElement>;
    subscriptions: Subscription[];
    contacts: Contact[];
    handleEditSubscription: (subscription: Subscription) => void;
}

export const SubscriptionList: React.FC<Props> = ({
    tableRef,
    subscriptions,
    contacts,
    handleEditSubscription,
}) => {
    return (
        <div className={cn("items-container")}>
            <table ref={tableRef} className={cn("items")}>
                <tbody>
                    {subscriptions.map((subscription) => (
                        <SubscriptionRow
                            key={subscription.id}
                            subscription={subscription}
                            contacts={contacts}
                            onEditSubscription={handleEditSubscription}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
