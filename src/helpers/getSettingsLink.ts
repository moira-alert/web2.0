import { getPageLink } from "../Domain/Global";
import { Team } from "../Domain/Team";

export const LOCAL_STORAGE_TEAM_KEY = "selectedTeam";

export const getSettingsLink = (teams: Team[] = []): string => {
    const teamId = localStorage.getItem(LOCAL_STORAGE_TEAM_KEY);
    return teamId && teams.some((team) => team.id === teamId)
        ? getPageLink("teamSettings", teamId)
        : getPageLink("settings");
};
