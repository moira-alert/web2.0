import React, { useState, useContext } from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import AddIcon from "@skbkontur/react-icons/Add";
import { Fill, RowStack, Fit } from "@skbkontur/react-stack-layout";
import { Subscription } from "../../Domain/Subscription";
import { createSchedule, WholeWeek } from "../../Domain/Schedule";
import { Contact } from "../../Domain/Contact";
import SubscriptionEditModal from "../../Components/SubscriptionEditModal/SubscriptionEditModal";
import CreateSubscriptionModal from "../../Components/CreateSubscriptionModal/CreateSubscriptionModal";
import type { SubscriptionInfo } from "../../Components/SubscriptionEditor/SubscriptionEditor";
import TagDropdownSelect from "../../Components/TagDropdownSelect/TagDropdownSelect";
import { ConfigContext } from "../../contexts/ConfigContext";
import { SubscriptionList } from "../../Components/SubscriptionList/SubscriptionList";
import { filterSubscriptions } from "../../Domain/FilterSubscriptions";
import { AddSubscriptionMessage } from "../../Components/AddSubscribtionMessage/AddSubscribtionMessage";

import cn from "./SubscriptionListContainer.less";
import { ModalType } from "../../Domain/Global";

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
    const [filterTags, setFilterTags] = useState<string[]>([]);
    const { filteredSubscriptions, availableTags } = filterSubscriptions(subscriptions, filterTags);

    const isPlottingDefaultOn =
        useContext(ConfigContext)?.featureFlags?.isPlottingDefaultOn ?? true;

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

    const handleFilterTagsChange = (tags: string[]): void => {
        setFilterTags(tags);
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
        <div>
            {subscriptions.length > 0 ? (
                <div>
                    {
                        <RowStack gap={1} baseline block>
                            <h2 className={cn("header")}>Subscriptions</h2>
                            <Fill />
                            <Fit>
                                <Button
                                    width={180}
                                    use="default"
                                    icon={<AddIcon />}
                                    onClick={handleAddSubscription}
                                >
                                    Add subscription
                                </Button>
                            </Fit>
                            <Fit>
                                <TagDropdownSelect
                                    width={280}
                                    value={filterTags}
                                    availableTags={availableTags}
                                    onChange={handleFilterTagsChange}
                                    placeholder=" Filter subscriptions by Tags"
                                />
                            </Fit>
                        </RowStack>
                    }
                    <SubscriptionList
                        tableRef={tableRef}
                        subscriptions={filteredSubscriptions}
                        contacts={contacts}
                        handleEditSubscription={handleEditSubscription}
                    />
                </div>
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
        </div>
    );
};
