import React, { FC, useState } from "react";
import { SubscriptionList } from "../Components/SubscriptionList/SubscriptionList";
import SubscriptionEditModal from "../Components/SubscriptionEditModal/SubscriptionEditModal";
import { Subscription } from "../Domain/Subscription";
import { useModal } from "../hooks/useModal";
import { useGetAllContactsQuery } from "../services/ContactApi";
import { useGetSystemTagsQuery } from "../services/TagsApi";

interface SystemSubscriptionsListProps {
    systemSubscriptions: Subscription[];
}

export const SystemSubscriptionsList: FC<SystemSubscriptionsListProps> = ({
    systemSubscriptions,
}) => {
    const [subscriptionToEdit, setSubscriptionToEdit] = useState<Subscription | null>(null);
    const { isModalOpen, openModal, closeModal } = useModal();

    const { data: contacts } = useGetAllContactsQuery();
    const { data: systemTags = [] } = useGetSystemTagsQuery();

    const handleEditSubscription = (subscription: Subscription): void => {
        setSubscriptionToEdit(subscription);
        openModal();
    };

    return (
        <>
            {contacts && systemSubscriptions && (
                <SubscriptionList
                    showOwnerColumn
                    handleEditSubscription={handleEditSubscription}
                    contacts={contacts}
                    subscriptions={systemSubscriptions}
                />
            )}
            {isModalOpen && subscriptionToEdit && contacts && (
                <SubscriptionEditModal
                    subscription={subscriptionToEdit}
                    tags={systemTags}
                    contacts={contacts}
                    onCancel={closeModal}
                />
            )}
        </>
    );
};
