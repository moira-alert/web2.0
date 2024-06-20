import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useGetUserQuery, useGetUserSettingsQuery } from "../services/UserApi";
import { useGetTeamSettingsQuery, useGetUserTeamsQuery } from "../services/TeamsApi";
import { useGetTagsQuery } from "../services/TagsApi";
import { toggleLoading, setError } from "../store/Reducers/UIReducer.slice";
import { useParams } from "react-router";

export const useLoadSettingsData = () => {
    const dispatch = useDispatch();
    const { teamId } = useParams<{ teamId: string }>();

    const { data: user, isLoading: isLoadingUser, error: errorUser } = useGetUserQuery();
    const {
        data: userSettings,
        isLoading: isLoadingUserSettings,
        error: errorUserSettings,
    } = useGetUserSettingsQuery(undefined, {
        skip: !!teamId,
    });
    const {
        data: teamSettings,
        isLoading: isLoadingTeamSettings,
        error: errorTeamSettings,
    } = useGetTeamSettingsQuery(teamId, {
        skip: !teamId,
    });
    const { data: teams, isLoading: isLoadingTeams, error: errorTeams } = useGetUserTeamsQuery();
    const { data: tags, isLoading: isLoadingTags, error: errorTags } = useGetTagsQuery();

    useEffect(() => {
        const isLoading =
            isLoadingUser ||
            isLoadingTags ||
            isLoadingTeamSettings ||
            isLoadingTeams ||
            isLoadingUserSettings;
        const error =
            errorUser || errorTags || errorTeamSettings || errorTeams || errorUserSettings;

        dispatch(toggleLoading(isLoading));
        dispatch(setError(error));
    }, [
        isLoadingUser,
        isLoadingUserSettings,
        isLoadingTeamSettings,
        isLoadingTeams,
        isLoadingTags,
        errorUser,
        errorUserSettings,
        errorTeamSettings,
        errorTeams,
        errorTags,
        teamId,
    ]);

    let team;
    if (teamId && teams) {
        team = teams.teams.find((teamOverview) => teamOverview.id === teamId);
    }

    const settings = teamId ? teamSettings : userSettings;

    return {
        login: user?.login,
        settings,
        tags,
        team,
        teams: teams?.teams,
    };
};
