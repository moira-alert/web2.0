import React, { useState, useEffect } from "react";
import { Contact } from "../../Domain/Contact";
import { Subscription } from "../../Domain/Subscription";
import { SubscriptionRow } from "./SubscriptionRow/SubscriptionRow";
import ArrowBoldDownIcon from "@skbkontur/react-icons/ArrowBoldDown";
import ArrowBoldUpIcon from "@skbkontur/react-icons/ArrowBoldUp";
import { useSortData } from "../../hooks/useSortData";
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
    const [colspan, setColspan] = useState(2);
    const { sortedData, sortConfig, handleSort } = useSortData(subscriptions, "contacts");

    // Adjust sort-tags button colspan in dependance of window size
    useEffect(() => {
        const resize = () => {
            const newColspan = window.innerWidth < 600 ? 3 : 2;
            setColspan(newColspan);
        };

        window.addEventListener("resize", resize);
        resize();

        return () => {
            window.removeEventListener("resize", resize);
        };
    }, []);

    const SortingIcon =
        sortConfig.direction === "descending" ? <ArrowBoldDownIcon /> : <ArrowBoldUpIcon />;
    return (
        <div className={cn("items-container")}>
            <table ref={tableRef} className={cn("items")}>
                <thead>
                    <tr className={cn("header")}>
                        <td colSpan={colspan}>
                            <button
                                onClick={() => handleSort("tags")}
                                type="button"
                                className={cn("sorting-button", "sort-tags")}
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
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((subscription) => (
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
