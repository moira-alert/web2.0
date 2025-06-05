import { useGetUserQuery, useGetUserSettingsQuery } from "../services/UserApi";
import {
    useGetTeamQuery,
    useGetTeamSettingsQuery,
    useGetUserTeamsQuery,
} from "../services/TeamsApi";
import { useGetTagsQuery } from "../services/TagsApi";
import { useParams } from "react-router";

export const useLoadSettingsData = (isTeamMember?: boolean) => {
    const { teamId = "" } = useParams<{ teamId: string }>();
    const { data: user } = useGetUserQuery();
    const { data: userSettings } = useGetUserSettingsQuery(undefined, {
        skip: !!teamId,
    });
    const { data: teamSettings } = useGetTeamSettingsQuery(
        { teamId },
        {
            skip: !teamId,
        }
    );
    const { data: tags } = useGetTagsQuery();
    const { data: nonMemberTeam } = useGetTeamQuery(teamId, {
        skip: !teamId,
    });
    const { data: teams } = useGetUserTeamsQuery();

    const team = isTeamMember
        ? teams?.find((teamOverview) => teamOverview.id === teamId)
        : nonMemberTeam;

    const settings = teamId ? teamSettings : userSettings;

    return {
        login: user?.login,
        isTeamMember,
        role: user?.role,
        settings,
        tags,
        team,
        teams,
    };
};
