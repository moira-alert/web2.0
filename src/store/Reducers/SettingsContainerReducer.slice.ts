import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { Settings } from "../../Domain/Settings";
import { Team } from "../../Domain/Team";
import { TagList } from "../../Api/MoiraApi";
import { Subscription } from "../../Domain/Subscription";

interface TeamsAndTags {
    login: string;
    teams: Team[];
    tags: TagList;
    // config: Config;
    team?: Team;
}

export interface ISettingsContainerState {
    teamsAndTags?: TeamsAndTags;
    settings?: Settings;
    disruptedSubs?: Subscription[];
}

const initialState: ISettingsContainerState = {
    teamsAndTags: undefined,
    settings: undefined,
    disruptedSubs: undefined,
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
        setDisruptedSubs: (state, action: PayloadAction<Subscription[]>) => {
            state.disruptedSubs = action.payload;
        },
    },
});

export const { setTeamsAndTags, setSettings, setDisruptedSubs } = SettingsSlice.actions;

export default SettingsSlice.reducer;
