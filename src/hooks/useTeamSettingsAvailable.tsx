import { EUserRoles } from "../Domain/User";
import { useIsTeamMember } from "./useIsTeamMember";

export const useTeamSettingsAvailable = (teamId: string) => {
    const { isTeamMember, isAuthorizing, user } = useIsTeamMember(teamId);

    const isTeamAvailable = (user?.auth_enabled && user?.role === EUserRoles.Admin) || isTeamMember;

    return { isTeamMember, isAuthorizing, isTeamAvailable };
};
