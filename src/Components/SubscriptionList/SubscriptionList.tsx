import React from "react";
import { Contact } from "../../Domain/Contact";
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

export const SubscriptionList: React.FC<Props> = ({
    subscriptions,
    contacts,
    showOwnerColumn,
    handleEditSubscription,
}) => {
    const { isTransferringSubscriptions, isEnablingSubscriptions } = useAppSelector(UIState);

    const { sortedData, sortConfig, handleSort } = useSortData(subscriptions, "contacts");

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
