import React, { useState } from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import AddIcon from "@skbkontur/react-icons/Add";
import { Subscription } from "../../Domain/Subscription";
import { Contact } from "../../Domain/Contact";
import SubscriptionEditModal from "../../Components/SubscriptionEditModal/SubscriptionEditModal";
import CreateSubscriptionModal from "../../Components/CreateSubscriptionModal/CreateSubscriptionModal";
import type { SubscriptionInfo } from "../../Components/SubscriptionEditor/SubscriptionEditor";
import { SubscriptionList } from "../../Components/SubscriptionList/SubscriptionList";
import { AddSubscriptionMessage } from "../../Components/AddSubscribtionMessage/AddSubscribtionMessage";
import { ModalType } from "../../Domain/Global";
import { FilterSubscriptionButtons } from "./Components/FilterSubscriptionButtons";
import { useFilterSubscriptions } from "../../hooks/useFilterSubscriptions";
import classNames from "classnames/bind";

import styles from "./SubscriptionListContainer.less";

const cn = classNames.bind(styles);

export type { SubscriptionInfo };

interface Props {
    tags: string[];
    contacts: Contact[];
    subscriptions: Subscription[];
}

export const SubscriptionListContainer: React.FC<Props> = ({ tags, contacts, subscriptions }) => {
    const [subscriptionToEdit, setSubscriptionToEdit] = useState<Subscription | null>(null);

    const [modalVisibility, setModalVisibility] = useState({
        [ModalType.subscriptionEditModal]: false,
        [ModalType.newSubscriptionModal]: false,
    });

    const openModal = (modalName: ModalType) => {
        setModalVisibility((prevState) => ({
            ...prevState,
            [modalName]: true,
        }));
    };

    const closeModal = (modalName: ModalType) => {
        setModalVisibility((prevState) => ({
            ...prevState,
            [modalName]: false,
        }));
    };

    const {
        filteredSubscriptions,
        availableTags,
        availableContactIDs,
        filterContactIDs,
        filterTags,
        handleSetFilterTags,
        handleSetFilterContactIDs,
    } = useFilterSubscriptions(subscriptions);

    const handleEditSubscription = (subscription: Subscription): void => {
        openModal(ModalType.subscriptionEditModal);
        setSubscriptionToEdit(subscription);
    };

    const handleAddSubscription = () => {
        openModal(ModalType.newSubscriptionModal);
    };

    return (
        <>
            {subscriptions.length > 0 ? (
                <>
                    <div className={cn("row")}>
                        <h2 className={cn("header")}>Subscriptions</h2>
                        <div className={cn("subscriptionBtnContainer")}>
                            <Button
                                width={180}
                                use="default"
                                icon={<AddIcon />}
                                onClick={handleAddSubscription}
                            >
                                Add subscription
                            </Button>
                            <FilterSubscriptionButtons
                                contacts={contacts}
                                filterContactIDs={filterContactIDs}
                                availableContactIDs={availableContactIDs}
                                filterTags={filterTags}
                                availableTags={availableTags}
                                handleFilterContactsChange={handleSetFilterContactIDs}
                                handleFilterTagsChange={handleSetFilterTags}
                            />
                        </div>
                    </div>
                    <SubscriptionList
                        subscriptions={filteredSubscriptions}
                        contacts={contacts}
                        handleEditSubscription={handleEditSubscription}
                    />
                </>
            ) : (
                <AddSubscriptionMessage onAddSubscription={handleAddSubscription} />
            )}
            {modalVisibility.newSubscriptionModal && (
                <CreateSubscriptionModal
                    tags={tags}
                    contacts={contacts}
                    onCancel={() => closeModal(ModalType.newSubscriptionModal)}
                />
            )}
            {modalVisibility.subscriptionEditModal && subscriptionToEdit != null && (
                <SubscriptionEditModal
                    subscription={subscriptionToEdit}
                    tags={tags}
                    contacts={contacts}
                    onCancel={() => closeModal(ModalType.subscriptionEditModal)}
                />
            )}
        </>
    );
};
