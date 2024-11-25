import { useDeleteSubscriptionMutation } from "../services/SubscriptionsApi";
import { useDeleteTeamMutation, useGetTeamSettingsQuery } from "../services/TeamsApi";
import { useDeleteContactMutation } from "../services/ContactApi";
import { useDeleteAllUsersFromTeam } from "./useDeleteAllUsersFromTeam";
import { Subscription } from "../Domain/Subscription";
import { Contact } from "../Domain/Contact";

export const useFullyDeleteTeam = (teamId: string, skip?: boolean) => {
    const { data: teamSettings, isLoading: isGettingSettings } = useGetTeamSettingsQuery(
        { teamId, handleLoadingLocally: true },
        { skip }
    );

    const [
        deleteSubscription,
        { isLoading: isDeletingSubscriptions },
    ] = useDeleteSubscriptionMutation();
    const [deleteContact, { isLoading: isDeletingContacts }] = useDeleteContactMutation();
    const [deleteTeam, { isLoading: isDeletingTeam }] = useDeleteTeamMutation();
    const {
        isGettingTeamUsers,
        isDeletingUsers,
        deleteAllUsersFromTeam,
    } = useDeleteAllUsersFromTeam(teamId, skip);

    const deleteSubscriptions = async (subscriptions: Subscription[]) => {
        await Promise.all(
            subscriptions.map((subscription) =>
                deleteSubscription({
                    id: subscription.id,
                    handleLoadingLocally: true,
                    handleErrorLocally: true,
                }).unwrap()
            )
        );
    };

    const deleteContacts = async (contacts: Contact[]) => {
        await Promise.all(
            contacts.map((contact) =>
                deleteContact({
                    id: contact.id,
                    handleLoadingLocally: true,
                    handleErrorLocally: true,
                }).unwrap()
            )
        );
    };

    const handleFullyDeleteTeam = async () => {
        if (teamSettings) {
            const { subscriptions, contacts } = teamSettings;

            await deleteSubscriptions(subscriptions);
            await deleteContacts(contacts);
        }

        await deleteAllUsersFromTeam();

        await deleteTeam({
            teamId,
            handleLoadingLocally: true,
            handleErrorLocally: true,
        }).unwrap();
    };

    const isFetchingData = isGettingTeamUsers || isGettingSettings;

    return {
        isFetchingData,
        isDeletingContacts,
        isDeletingSubscriptions,
        isDeletingUsers,
        isDeletingTeam,
        handleFullyDeleteTeam,
    };
};
