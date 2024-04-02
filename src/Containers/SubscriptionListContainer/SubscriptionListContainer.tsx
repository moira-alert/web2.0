import React, { useState } from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import AddIcon from "@skbkontur/react-icons/Add";
import { Subscription } from "../../Domain/Subscription";
import { createSchedule, WholeWeek } from "../../Domain/Schedule";
import { Contact } from "../../Domain/Contact";
import SubscriptionEditModal from "../../Components/SubscriptionEditModal/SubscriptionEditModal";
import CreateSubscriptionModal from "../../Components/CreateSubscriptionModal/CreateSubscriptionModal";
import type { SubscriptionInfo } from "../../Components/SubscriptionEditor/SubscriptionEditor";
import { SubscriptionList } from "../../Components/SubscriptionList/SubscriptionList";
import { AddSubscriptionMessage } from "../../Components/AddSubscribtionMessage/AddSubscribtionMessage";
import { ModalType } from "../../Domain/Global";
import { ConfigState } from "../../store/selectors";
import { useAppSelector } from "../../store/hooks";
import { FilterSubscriptionButtons } from "./Components/FilterSubscriptionButtons";
import { useFilterSubscriptions } from "../../hooks/useFilterSubscriptions";
import classNames from "classnames/bind";

import styles from "./SubscriptionListContainer.less";

const cn = classNames.bind(styles);

export type { SubscriptionInfo };

interface Props {
    tableRef?: React.Ref<HTMLTableElement>;
    tags: string[];
    contacts: Contact[];
    subscriptions: Subscription[];
    onAddSubscription: (subscriptionInfo: SubscriptionInfo) => Promise<Subscription | undefined>;
    onRemoveSubscription: (subscription: Subscription) => Promise<void>;
    onUpdateSubscription: (subscription: Subscription) => Promise<void>;
    onTestSubscription: (subscription: Subscription) => Promise<void>;
}

export const SubscriptionListContainer: React.FC<Props> = (props) => {
    const {
        tableRef,
        tags,
        contacts,
        subscriptions,
        onAddSubscription,
        onRemoveSubscription,
        onUpdateSubscription,
        onTestSubscription,
    } = props;

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

    const [newSubscription, setNewSubscription] = useState<SubscriptionInfo | null>(null);
    const [subscriptionToEdit, setSubscriptionToEdit] = useState<Subscription | null>(null);

    const {
        filteredSubscriptions,
        availableTags,
        availableContactIDs,
        filterContactIDs,
        filterTags,
        handleSetFilterTags,
        handleSetFilterContactIDs,
    } = useFilterSubscriptions(subscriptions);

    const { config } = useAppSelector(ConfigState);

    const isPlottingDefaultOn = !!config?.featureFlags.isPlottingDefaultOn;

    const handleCloseModal = (modal: ModalType) => {
        closeModal(modal);
        switch (modal) {
            case ModalType.newSubscriptionModal:
                setNewSubscription(null);
                break;
            case ModalType.subscriptionEditModal:
                setSubscriptionToEdit(null);
                break;
        }
    };

    const handleEditSubscription = (subscription: Subscription): void => {
        openModal(ModalType.subscriptionEditModal);
        setSubscriptionToEdit(subscription);
    };

    const handleAddSubscription = () => {
        openModal(ModalType.newSubscriptionModal);
        setNewSubscription({
            any_tags: false,
            sched: createSchedule(WholeWeek),
            tags: [],
            throttling: false,
            contacts: [],
            enabled: true,
            ignore_recoverings: false,
            ignore_warnings: false,
            plotting: {
                enabled: isPlottingDefaultOn,
                theme: "light",
            },
        });
    };

    const handleCreateSubscription = async (): Promise<void> => {
        if (newSubscription == null) {
            throw new Error("InvalidProgramState");
        }
        await onAddSubscription(newSubscription);
        handleCloseModal(ModalType.newSubscriptionModal);
    };

    const handleCreateAndTestSubscription = async (): Promise<void> => {
        if (newSubscription == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            const subscription = await onAddSubscription(newSubscription);
            if (subscription !== null && subscription !== undefined) {
                await onTestSubscription(subscription);
            }
        } finally {
            handleCloseModal(ModalType.newSubscriptionModal);
        }
    };

    const handleUpdateSubscription = async (): Promise<void> => {
        if (subscriptionToEdit == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            await onUpdateSubscription(subscriptionToEdit);
        } finally {
            handleCloseModal(ModalType.subscriptionEditModal);
        }
    };

    const handleUpdateAndTestSubscription = async (): Promise<void> => {
        if (subscriptionToEdit == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            await onUpdateSubscription(subscriptionToEdit);
            await onTestSubscription(subscriptionToEdit);
        } finally {
            handleCloseModal(ModalType.subscriptionEditModal);
        }
    };

    const handleRemoveSubscription = async (): Promise<void> => {
        if (subscriptionToEdit == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            await onRemoveSubscription(subscriptionToEdit);
        } finally {
            handleCloseModal(ModalType.subscriptionEditModal);
        }
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
                                handleSetCheckbox={handleSetFilterContactIDs}
                                handleFilterTagsChange={handleSetFilterTags}
                            />
                        </div>
                    </div>
                    <SubscriptionList
                        tableRef={tableRef}
                        subscriptions={filteredSubscriptions}
                        contacts={contacts}
                        handleEditSubscription={handleEditSubscription}
                    />
                </>
            ) : (
                <AddSubscriptionMessage onAddSubscription={handleAddSubscription} />
            )}
            {modalVisibility.newSubscriptionModal && newSubscription != null && (
                <CreateSubscriptionModal
                    subscription={newSubscription}
                    tags={tags}
                    contacts={contacts}
                    onChange={(update) => setNewSubscription({ ...newSubscription, ...update })}
                    onCancel={() => closeModal(ModalType.newSubscriptionModal)}
                    onCreateSubscription={handleCreateSubscription}
                    onCreateAndTestSubscription={handleCreateAndTestSubscription}
                />
            )}
            {modalVisibility.subscriptionEditModal && subscriptionToEdit != null && (
                <SubscriptionEditModal
                    subscription={subscriptionToEdit}
                    tags={tags}
                    contacts={contacts}
                    onChange={(update) =>
                        setSubscriptionToEdit({ ...subscriptionToEdit, ...update })
                    }
                    onCancel={() => closeModal(ModalType.subscriptionEditModal)}
                    onUpdateSubscription={handleUpdateSubscription}
                    onUpdateAndTestSubscription={handleUpdateAndTestSubscription}
                    onRemoveSubscription={handleRemoveSubscription}
                />
            )}
        </>
    );
};
