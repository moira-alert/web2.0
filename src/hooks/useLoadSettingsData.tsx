import { useGetUserQuery, useGetUserSettingsQuery } from "../services/UserApi";
import { useGetTeamSettingsQuery, useGetUserTeamsQuery } from "../services/TeamsApi";
import { useGetTagsQuery } from "../services/TagsApi";
import { useParams } from "react-router";

export const useLoadSettingsData = () => {
    const { teamId } = useParams<{ teamId: string }>();

    const { data: user } = useGetUserQuery();
    const { data: userSettings } = useGetUserSettingsQuery(undefined, {
        skip: !!teamId,
    });
    const { data: teamSettings } = useGetTeamSettingsQuery(teamId, {
        skip: !teamId,
    });
    const { data: teams } = useGetUserTeamsQuery();
    const { data: tags } = useGetTagsQuery();

    const team = teamId ? teams?.teams.find((teamOverview) => teamOverview.id === teamId) : null;

    const settings = teamId ? teamSettings : userSettings;

    return {
        login: user?.login,
        settings,
        tags,
        team,
        teams: teams?.teams,
    };
};
