import React from "react";
import { Contact, filterSubscriptionContacts } from "../../Domain/Contact";
import { Subscription } from "../../Domain/Subscription";
import { SubscriptionRow } from "./SubscriptionRow/SubscriptionRow";
import ArrowBoldDownIcon from "@skbkontur/react-icons/ArrowBoldDown";
import ArrowBoldUpIcon from "@skbkontur/react-icons/ArrowBoldUp";
import { useSortData } from "../../hooks/useSortData";
import { useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";
import classNames from "classnames/bind";

import styles from "./SubscriptionList.module.less";

const cn = classNames.bind(styles);

interface Props {
    subscriptions: Subscription[];
    contacts: Contact[];
    showOwnerColumn?: boolean;
    handleEditSubscription: (subscription: Subscription) => void;
}

const prepareSubscriptions = (subscriptions: Subscription[], contacts: Contact[]) => {
    return subscriptions.map((s) => {
        const sortedTags = [...s.tags].sort((a, b) =>
            a.localeCompare(b, undefined, { numeric: true })
        );

        const subContacts: Contact[] = filterSubscriptionContacts(contacts, s);

        const sortedContacts = [...subContacts]
            .sort((a, b) => {
                const aKey = a.name || a.value;
                const bKey = b.name || b.value;
                return aKey.localeCompare(bKey, undefined, { numeric: true });
            })
            .map((c) => c.id);

        return {
            ...s,
            tags: sortedTags,
            contacts: sortedContacts,
        };
    });
};

export const SubscriptionList: React.FC<Props> = ({
    subscriptions,
    contacts,
    showOwnerColumn,
    handleEditSubscription,
}) => {
    const { isTransferringSubscriptions, isEnablingSubscriptions } = useAppSelector(UIState);
    const preparedSubscriptions = prepareSubscriptions(subscriptions, contacts);
    const { sortedData, sortConfig, handleSort } = useSortData<Subscription>(
        preparedSubscriptions,
        "contacts",
        (subscription, column) => {
            const value = subscription[column];

            if (column === "contacts" && Array.isArray(value)) {
                return value
                    .map((contactId) => {
                        const contact = contacts.find((c) => c.id === contactId);
                        return contact?.name || contact?.value;
                    })
                    .join(",");
            }

            if (column === "tags" && Array.isArray(value)) {
                return value.join(",");
            }

            return String(value);
        }
    );
    const SortingIcon =
        sortConfig.direction === "desc" ? <ArrowBoldDownIcon /> : <ArrowBoldUpIcon />;
    return (
        <div className={cn("items-container")}>
            <table className={cn("items")}>
                <thead>
                    <tr className={cn("header")}>
                        {(isTransferringSubscriptions || isEnablingSubscriptions) && (
                            <td style={{ position: "absolute" }}></td>
                        )}
                        <td className={cn("fold-button-gap")} />
                        <td colSpan={2}>
                            <button
                                onClick={() => handleSort("tags")}
                                type="button"
                                className={cn("sorting-button")}
                            >
                                Tags {sortConfig.sortingColumn === "tags" && SortingIcon}
                            </button>
                        </td>
                        <td>
                            <button
                                onClick={() => handleSort("contacts")}
                                type="button"
                                className={cn("sorting-button")}
                            >
                                Contacts {sortConfig.sortingColumn === "contacts" && SortingIcon}
                            </button>
                        </td>
                        {showOwnerColumn && <td>Owner</td>}
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((subscription) => (
                        <SubscriptionRow
                            key={subscription.id}
                            subscription={subscription}
                            contacts={contacts}
                            onEditSubscription={handleEditSubscription}
                            showOwnerColumn={showOwnerColumn}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};
