import { EUserRoles } from "../Domain/User";
import { useIsTeamMember } from "./useIsTeamMember";

export const useTeamSettingsAvailable = (teamId: string) => {
    const { isTeamMember, isAuthorizing, user } = useIsTeamMember(teamId);

    const isTeamAvailable = user?.role === EUserRoles.Admin || isTeamMember;

    return { isTeamMember, isAuthorizing, isTeamAvailable };
};
