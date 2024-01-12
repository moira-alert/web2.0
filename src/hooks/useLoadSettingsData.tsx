import MoiraApi from "../Api/MoiraApi";
import {
    Action,
    setTeamsAndTags,
    setSettings,
    setIsLoading,
    setError,
} from "./useSettingsContainerReducer";
import { Dispatch } from "react";

export const useLoadSettingsData = (
    moiraApi: MoiraApi,
    dispatch: Dispatch<Action>,
    teamId?: string
) => {
    const getTeamsAndTags = async () => {
        const [user, teams, tags, config] = await Promise.all([
            moiraApi.getUser(),
            moiraApi.getTeams(),
            moiraApi.getTagList(),
            moiraApi.getConfig(),
        ]);

        let team;

        if (teamId) {
            team = teams.teams.find((teamOverview) => teamOverview.id === teamId);
        }

        dispatch(
            setTeamsAndTags({ login: user.login, teams: teams.teams, tags: tags, config, team })
        );
    };
    const getTeamOrUserData = async (teamId?: string) => {
        const settings = teamId
            ? await moiraApi.getSettingsByTeam(teamId)
            : await moiraApi.getSettings();

        dispatch(setSettings(settings));
    };

    const loadData = async () => {
        dispatch(setIsLoading(true));
        try {
            await getTeamsAndTags();
            await getTeamOrUserData(teamId);
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setIsLoading(false));
        }
    };

    return { loadData, getTeamOrUserData };
};
