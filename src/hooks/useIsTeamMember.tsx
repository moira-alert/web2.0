import { useGetUserTeamsQuery } from "../services/TeamsApi";
import { useGetUserQuery } from "../services/UserApi";

export const useIsTeamMember = (teamId: string) => {
    const { data: user, isLoading: isGettingUser } = useGetUserQuery();
    const { data: userTeams, isLoading: isGettingUserTeams } = useGetUserTeamsQuery();

    return {
        isTeamMember: user?.login && userTeams?.some((team) => team.id === teamId),
        isAuthorizing: isGettingUserTeams || isGettingUser,
        user,
    };
};
