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
    tags: string[];
    contacts: Contact[];
    subscriptions: Subscription[];
}

export const SubscriptionListContainer: React.FC<Props> = (props) => {
    const { tags, contacts, subscriptions } = props;

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

    const isPlottingDefaultOn =
        !!config?.featureFlags.isPlottingDefaultOn && config.featureFlags.isPlottingAvailable;

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
            {modalVisibility.newSubscriptionModal && newSubscription != null && (
                <CreateSubscriptionModal
                    subscription={newSubscription}
                    tags={tags}
                    contacts={contacts}
                    onChange={(update) => setNewSubscription({ ...newSubscription, ...update })}
                    onCancel={() => closeModal(ModalType.newSubscriptionModal)}
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
                />
            )}
        </>
    );
};
