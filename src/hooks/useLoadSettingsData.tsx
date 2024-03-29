import MoiraApi from "../Api/MoiraApi";
import { useAppDispatch } from "../store/hooks";
import { toggleLoading, setError } from "../store/Reducers/UIReducer.slice";
import { setTeamsAndTags, setSettings } from "../store/Reducers/SettingsContainerReducer.slice";

export const useLoadSettingsData = (moiraApi: MoiraApi, teamId?: string) => {
    const dispatch = useAppDispatch();

    const getTeamsAndTags = async () => {
        const [user, teams, tags] = await Promise.all([
            moiraApi.getUser(),
            moiraApi.getTeams(),
            moiraApi.getTagList(),
        ]);

        let team;

        if (teamId) {
            team = teams.teams.find((teamOverview) => teamOverview.id === teamId);
        }

        dispatch(setTeamsAndTags({ login: user.login, teams: teams.teams, tags, team }));
    };
    const getTeamOrUserData = async (teamId?: string) => {
        const settings = teamId
            ? await moiraApi.getSettingsByTeam(teamId)
            : await moiraApi.getSettings();

        dispatch(setSettings(settings));
    };

    const loadData = async () => {
        dispatch(toggleLoading(true));
        try {
            await getTeamsAndTags();
            await getTeamOrUserData(teamId);
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(toggleLoading(false));
        }
    };

    return { loadData, getTeamOrUserData };
};
