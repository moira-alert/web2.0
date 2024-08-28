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
    setIsTransferringSubscriptions,
    setTransferingSubscriptions,
} from "../../store/Reducers/UIReducer.slice";
import { UIState } from "../../store/selectors";
import { BaseApi } from "../../services/BaseApi";
import { useTransferContactsToTeam } from "../../hooks/useTransferContactsToTeam";
import { useTransferSubscriptionsToTeam } from "../../hooks/useTransferSubscriptionsToTeam";
import { TransferSubscriptionsTeamSelect } from "../../Components/TransferSubscriptionsTeamSelect/TransferSubscriptionsTeamSelect";
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

export const SubscriptionListContainer: React.FC<Props> = ({
    tags,
    teams,
    contacts,
    subscriptions,
}) => {
    const dispatch = useAppDispatch();
    const { isTransferringSubscriptions, transferingSubscriptions } = useAppSelector(UIState);

    const { transferContactsToTeam } = useTransferContactsToTeam();
    const { transferSubscriptionsToTeam } = useTransferSubscriptionsToTeam();

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
            dispatch(setIsTransferringSubscriptions(false));
            return;
        }
        setTeamToTransfer(team);
        dispatch(setIsTransferringSubscriptions(true));
    };

    const contactIDsToTransfer = useMemo(
        () => new Set(transferingSubscriptions.flatMap((subscription) => subscription.contacts)),
        [transferingSubscriptions]
    );

    const handleTransferContactsAndSubscriptions = async () => {
        if (!teamToTransfer) {
            return;
        }

        const contactsToTransfer = contacts.filter((contact) =>
            contactIDsToTransfer.has(contact.id)
        );

        await transferContactsToTeam(contactsToTransfer, teamToTransfer?.id);
        await transferSubscriptionsToTeam(transferingSubscriptions, teamToTransfer?.id);

        dispatch(BaseApi.util.invalidateTags(["UserSettings", "TeamSettings"]));
        dispatch(setIsTransferringSubscriptions(false));
        dispatch(setTransferingSubscriptions([]));
        setTeamToTransfer(null);
    };

    const hasRemainingSubscriptionsWithTransferredContacts = useMemo(
        () =>
            subscriptions.some((subscription) => {
                if (transferingSubscriptions.includes(subscription)) {
                    return false;
                }

                return subscription.contacts.some((contact) => contactIDsToTransfer.has(contact));
            }),
        [transferingSubscriptions]
    );

    const isApplyTransferButtonDisabled =
        hasRemainingSubscriptionsWithTransferredContacts || !transferingSubscriptions.length;

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
                            {teams && teams?.length !== 0 && (
                                <TransferSubscriptionsTeamSelect
                                    teams={teams}
                                    teamToTransfer={teamToTransfer}
                                    handleSetTeamToTransfer={handleSetTeamToTransfer}
                                />
                            )}
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
                                    dispatch(setIsTransferringSubscriptions(false));
                                    setTeamToTransfer(null);
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
