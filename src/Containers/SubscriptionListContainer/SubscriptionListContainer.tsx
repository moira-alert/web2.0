import React, { useMemo, useState } from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import AddIcon from "@skbkontur/react-icons/Add";
import { Subscription } from "../../Domain/Subscription";
import { Contact } from "../../Domain/Contact";
import SubscriptionEditModal from "../../Components/SubscriptionEditModal/SubscriptionEditModal";
import CreateSubscriptionModal from "../../Components/CreateSubscriptionModal/CreateSubscriptionModal";
import { SubscriptionList } from "../../Components/SubscriptionList/SubscriptionList";
import { AddSubscriptionMessage } from "../../Components/AddSubscribtionMessage/AddSubscribtionMessage";
import { ModalType } from "../../Domain/Global";
import { FilterSubscriptionButtons } from "./Components/FilterSubscriptionButtons";
import { useFilterSubscriptions } from "../../hooks/useFilterSubscriptions";
import { Hint } from "@skbkontur/react-ui";
import { Team } from "../../Domain/Team";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
    setIsEnablingSubscriptions,
    setIsTransferingSubscriptions,
    setManagingSubscriptions,
} from "../../store/Reducers/UIReducer.slice";
import { UIState } from "../../store/selectors";
import { BaseApi } from "../../services/BaseApi";
import { useTransferContactsToTeam } from "../../hooks/useTransferContactsToTeam";
import { useTransferSubscriptionsToTeam } from "../../hooks/useTransferSubscriptionsToTeam";
import { ManageSubscriptionsSelect } from "../../Components/ManageSubscriptionsSelect/ManageSubscriptionsSelect";
import { useEnableSubscriptionsBatch } from "../../hooks/useEnableSubscriptionsBatch";
import classNames from "classnames/bind";

import styles from "./SubscriptionListContainer.less";

const cn = classNames.bind(styles);

interface Props {
    tags: string[];
    teams?: Team[];
    contacts: Contact[];
    subscriptions: Subscription[];
}

const applyTransferButtonHintText =
    "Remaining subscriptions and subscriptions to be transferred must not share contacts";

const applyEnablingButtonHintText =
    "All of subscriptions must be in particular Enabled or Disabled state ";

const getEnableButtonName = (subscriptions: Subscription[]) => {
    if (!subscriptions.length) return "Enable/Disable";

    const allEnabled = subscriptions.every((s) => s.enabled);
    const allDisabled = subscriptions.every((s) => !s.enabled);

    if (allEnabled) return "Disable";
    if (allDisabled) return "Enable";

    return "Enable/Disable";
};

export const SubscriptionListContainer: React.FC<Props> = ({
    tags,
    teams,
    contacts,
    subscriptions,
}) => {
    const dispatch = useAppDispatch();
    const {
        isTransferringSubscriptions,
        managingSubscriptions,
        isEnablingSubscriptions,
    } = useAppSelector(UIState);

    const { transferContactsToTeam } = useTransferContactsToTeam();
    const { transferSubscriptionsToTeam } = useTransferSubscriptionsToTeam();
    const { enableSubscriptions } = useEnableSubscriptionsBatch();

    const [subscriptionToEdit, setSubscriptionToEdit] = useState<Subscription | null>(null);
    const [teamToTransfer, setTeamToTransfer] = useState<Team | null>(null);

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

    const handleSetTeamToTransfer = (team: Team) => {
        if (team.id === teamToTransfer?.id) {
            setTeamToTransfer(null);
            dispatch(setIsTransferingSubscriptions(false));
            return;
        }
        setTeamToTransfer(team);
        dispatch(setIsTransferingSubscriptions(true));
    };

    const contactIDsToTransfer = useMemo(
        () => new Set(managingSubscriptions.flatMap((subscription) => subscription.contacts)),
        [managingSubscriptions]
    );

    const handleTransferContactsAndSubscriptions = async () => {
        if (!teamToTransfer) {
            return;
        }

        const contactsToTransfer = contacts.filter((contact) =>
            contactIDsToTransfer.has(contact.id)
        );

        await transferContactsToTeam(contactsToTransfer, teamToTransfer?.id);
        await transferSubscriptionsToTeam(managingSubscriptions, teamToTransfer?.id);

        dispatch(BaseApi.util.invalidateTags(["UserSettings", "TeamSettings"]));
        dispatch(setIsTransferingSubscriptions(false));
        dispatch(setManagingSubscriptions([]));
        setTeamToTransfer(null);
    };

    const handleEnableSubscriptionBatch = async () => {
        await enableSubscriptions(managingSubscriptions);

        dispatch(setIsEnablingSubscriptions(false));
        dispatch(BaseApi.util.invalidateTags(["UserSettings", "TeamSettings"]));
        dispatch(setManagingSubscriptions([]));
    };

    const hasRemainingSubscriptionsWithTransferredContacts = useMemo(
        () =>
            subscriptions.some((subscription) => {
                if (managingSubscriptions.includes(subscription)) {
                    return false;
                }

                return subscription.contacts.some((contact) => contactIDsToTransfer.has(contact));
            }),
        [managingSubscriptions]
    );

    const isApplyTransferButtonDisabled =
        hasRemainingSubscriptionsWithTransferredContacts ||
        !managingSubscriptions.length ||
        isEnablingSubscriptions;

    const isEnableSubscriptionsButtonDisabled =
        managingSubscriptions.length === 0 ||
        new Set(managingSubscriptions.map((s) => s.enabled)).size > 1;

    const enableButtonName = getEnableButtonName(managingSubscriptions);

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
                            <ManageSubscriptionsSelect
                                teams={teams}
                                teamToTransfer={teamToTransfer}
                                handleSetTeamToTransfer={handleSetTeamToTransfer}
                            />
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
                    {isTransferringSubscriptions && (
                        <div className={cn("transfer-btns")}>
                            <Hint
                                text={
                                    isApplyTransferButtonDisabled ? applyTransferButtonHintText : ""
                                }
                            >
                                <Button
                                    disabled={isApplyTransferButtonDisabled}
                                    onClick={handleTransferContactsAndSubscriptions}
                                    use="primary"
                                >
                                    Apply transfer
                                </Button>
                            </Hint>
                            <Button
                                onClick={() => {
                                    dispatch(setIsTransferingSubscriptions(false));
                                    setTeamToTransfer(null);
                                }}
                                use="danger"
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
                    {isEnablingSubscriptions && (
                        <div className={cn("transfer-btns")}>
                            <Hint
                                text={
                                    isEnableSubscriptionsButtonDisabled
                                        ? applyEnablingButtonHintText
                                        : ""
                                }
                            >
                                <Button
                                    disabled={isEnableSubscriptionsButtonDisabled}
                                    use="primary"
                                    onClick={handleEnableSubscriptionBatch}
                                >
                                    {enableButtonName}
                                </Button>
                            </Hint>
                            <Button
                                onClick={() => {
                                    dispatch(setIsEnablingSubscriptions(false));
                                }}
                                use="danger"
                            >
                                Cancel
                            </Button>
                        </div>
                    )}
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
