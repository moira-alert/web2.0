import { useDeleteUserFromTeamMutation, useGetTeamUsersQuery } from "../services/TeamsApi";
import { useGetUserQuery } from "../services/UserApi";
import { useCallback } from "react";

export const useDeleteAllUsersFromTeam = (teamId: string, skip?: boolean) => {
    const { data: users, isLoading: isGettingUsers } = useGetTeamUsersQuery(
        {
            teamId,
            handleLoadingLocally: true,
            handleErrorLocally: true,
        },
        { skip }
    );
    const { data: currentUser, isLoading: isGettingCurrentUser } = useGetUserQuery(
        {
            handleLoadingLocally: true,
            handleErrorLocally: true,
        },
        { skip }
    );
    const [deleteUserFromTeam, { isLoading: isDeletingUsers }] = useDeleteUserFromTeamMutation();

    const usersToDelete = users?.filter((user) => user !== currentUser?.login);

    const deleteAllUsersFromTeam = useCallback(async () => {
        if (usersToDelete)
            for (const user of usersToDelete) {
                await deleteUserFromTeam({
                    teamId,
                    userName: user,
                    handleLoadingLocally: true,
                    handleErrorLocally: true,
                }).unwrap();
            }
    }, [usersToDelete]);

    const isGettingTeamUsers = isGettingCurrentUser || isGettingUsers;

    return { isGettingTeamUsers, isDeletingUsers, deleteAllUsersFromTeam };
};
