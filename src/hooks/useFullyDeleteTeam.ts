import { useDeleteSubscriptionMutation } from "../services/SubscriptionsApi";
import { useDeleteTeamMutation, useGetTeamSettingsQuery } from "../services/TeamsApi";
import { useDeleteContactMutation } from "../services/ContactApi";
import { useDeleteAllUsersFromTeam } from "./useDeleteAllUsersFromTeam";

export const useFyllyDeleteTeam = (teamId: string, skip?: boolean) => {
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

    const handleFullyDeleteTeam = async () => {
        if (teamSettings) {
            const { subscriptions, contacts } = teamSettings;

            await Promise.all(
                subscriptions.map(async (subscription) => {
                    await deleteSubscription({
                        id: subscription.id,
                        handleLoadingLocally: true,
                        handleErrorLocally: true,
                    }).unwrap();
                })
            );

            await Promise.all(
                contacts.map(async (contact) => {
                    await deleteContact({
                        id: contact.id,
                        handleLoadingLocally: true,
                        handleErrorLocally: true,
                    }).unwrap();
                })
            );
        }

        await deleteAllUsersFromTeam();

        await deleteTeam({
            teamId,
            handleLoadingLocally: true,
            handleErrorLocally: true,
        });
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
