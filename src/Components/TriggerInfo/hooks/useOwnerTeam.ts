import { useGetUserTeamsQuery } from "../../../services/TeamsApi";
import { useIsAdmin } from "../../../hooks/useIsAdmin";
import { useIsTeamMember } from "../../../hooks/useIsTeamMember";

export const useOwnerTeam = (teamId?: string | null) => {
    const { data: teams } = useGetUserTeamsQuery();
    const isAdmin = useIsAdmin();
    const { isTeamMember } = useIsTeamMember(teamId ?? "");
    const ownerTeam = teams?.find((team) => team.id === teamId);
    const isShown = !!(ownerTeam && (isAdmin || isTeamMember));
    return { ownerTeam, isShown };
};
