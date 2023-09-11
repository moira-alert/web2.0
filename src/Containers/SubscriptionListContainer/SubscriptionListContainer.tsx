import React, { useState, useContext } from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Center } from "@skbkontur/react-ui/components/Center";
import { Gapped } from "@skbkontur/react-ui/components/Gapped";
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
import { filterSubscriptions } from "../../helpers/common";

import cn from "./SubscriptionListContainer.less";

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

    const [subscriptionEditModalVisible, setSubscriptionEditModalVisible] = useState(false);
    const [newSubscriptionModalVisible, setNewSubscriptionModalVisible] = useState(false);
    const [newSubscription, setNewSubscription] = useState<SubscriptionInfo | undefined>(undefined);
    const [subscriptionToEdit, setSubscriptionToEdit] = useState<Subscription | undefined>(
        undefined
    );
    const [filterTags, setFilterTags] = useState<string[]>([]);
    const { filteredSubscriptions, availableTags } = filterSubscriptions(subscriptions, filterTags);

    const isPlottingDefaultOn =
        useContext(ConfigContext)?.featureFlags?.isPlottingDefaultOn ?? true;

    const handleFilterTagsChange = (tags: string[]): void => {
        setFilterTags(tags);
    };

    const handleEditSubscription = (subscription: Subscription): void => {
        setSubscriptionEditModalVisible(true);
        setSubscriptionToEdit(subscription);
    };

    const handleAddSubscription = () => {
        setNewSubscriptionModalVisible(true);
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
        setNewSubscriptionModalVisible(false);
        setNewSubscription(undefined);
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
            setNewSubscriptionModalVisible(false);
            setNewSubscription(undefined);
        }
    };

    const handleUpdateSubscription = async (): Promise<void> => {
        if (subscriptionToEdit == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            await onUpdateSubscription(subscriptionToEdit);
        } finally {
            setSubscriptionEditModalVisible(false);
            setSubscriptionToEdit(undefined);
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
            setSubscriptionEditModalVisible(false);
            setSubscriptionToEdit(undefined);
        }
    };

    const handleRemoveSubscription = async (): Promise<void> => {
        if (subscriptionToEdit == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            await onRemoveSubscription(subscriptionToEdit);
        } finally {
            setSubscriptionEditModalVisible(false);
            setSubscriptionToEdit(undefined);
        }
    };

    const renderAddSubscriptionMessage = (): React.ReactElement => {
        return (
            <Center>
                <Gapped vertical gap={20}>
                    <div>
                        To start receiving notifications you have to{" "}
                        <Button use="link" onClick={handleAddSubscription}>
                            add subscription
                        </Button>
                        .
                    </div>
                    <Center>
                        <Button use="primary" icon={<AddIcon />} onClick={handleAddSubscription}>
                            Add subscription
                        </Button>
                    </Center>
                </Gapped>
            </Center>
        );
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
                renderAddSubscriptionMessage()
            )}
            {newSubscriptionModalVisible && newSubscription != null && (
                <CreateSubscriptionModal
                    subscription={newSubscription}
                    tags={tags}
                    contacts={contacts}
                    onChange={(update) => setNewSubscription({ ...newSubscription, ...update })}
                    onCancel={() => setNewSubscriptionModalVisible(false)}
                    onCreateSubscription={handleCreateSubscription}
                    onCreateAndTestSubscription={handleCreateAndTestSubscription}
                />
            )}
            {subscriptionEditModalVisible && subscriptionToEdit != null && (
                <SubscriptionEditModal
                    subscription={subscriptionToEdit}
                    tags={tags}
                    contacts={contacts}
                    onChange={(update) =>
                        setSubscriptionToEdit({ ...subscriptionToEdit, ...update })
                    }
                    onCancel={() => setSubscriptionEditModalVisible(false)}
                    onUpdateSubscription={handleUpdateSubscription}
                    onUpdateAndTestSubscription={handleUpdateAndTestSubscription}
                    onRemoveSubscription={handleRemoveSubscription}
                />
            )}
        </div>
    );
};
