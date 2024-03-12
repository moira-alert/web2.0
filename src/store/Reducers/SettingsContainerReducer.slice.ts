import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { Settings } from "../../Domain/Settings";
import { Team } from "../../Domain/Team";
import { TagList } from "../../Api/MoiraApi";

interface TeamsAndTags {
    login: string;
    teams: Team[];
    tags: TagList;
    team?: Team;
}

export interface ISettingsContainerState {
    teamsAndTags?: TeamsAndTags;
    settings?: Settings;
}

const initialState: ISettingsContainerState = {
    teamsAndTags: undefined,
    settings: undefined,
};

const SettingsSlice = createSlice({
    name: "settings",
    initialState,
    reducers: {
        setTeamsAndTags: (state, action: PayloadAction<Partial<TeamsAndTags>>) => {
            state.teamsAndTags = { ...state.teamsAndTags, ...(action.payload as TeamsAndTags) };
        },
        setSettings: (state, action: PayloadAction<Partial<Settings>>) => {
            state.settings = { ...state.settings, ...(action.payload as Settings) };
        },
    },
});

export const { setTeamsAndTags, setSettings } = SettingsSlice.actions;

export default SettingsSlice.reducer;
