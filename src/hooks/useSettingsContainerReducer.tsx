import { useReducer } from "react";
import type { Config } from "../Domain/Config";
import type { Settings } from "../Domain/Settings";
import { Team } from "../Domain/Team";
import { TagList } from "../Api/MoiraApi";
import { Subscription } from "../Domain/Subscription";

interface TeamsAndTags {
    login: string;
    teams: Team[];
    tags: TagList;
    config: Config;
    team?: Team;
}

export interface State {
    isLoading: boolean;
    isShowSubCrashModal: boolean;
    error?: string | null;
    teamsAndTags?: TeamsAndTags;
    settings?: Settings;
    disruptedSubs?: Subscription[];
}

export enum ActionType {
    setIsLoading = "setIsLoading",
    setShowSubCrashModal = "setShowSubCrashModal",
    setError = "setError",
    setTeamsAndTags = "setTeamsAndTags",
    setSettings = "setSettings",
    setDisruptedSubs = "setDisruptedSubs",
}

export const setIsLoading = (payload: boolean): Action => ({
    type: ActionType.setIsLoading,
    payload,
});
export const setShowSubCrashModal = (payload: boolean): Action => ({
    type: ActionType.setShowSubCrashModal,
    payload,
});
export const setError = (payload: string | null): Action => ({
    type: ActionType.setError,
    payload,
});
export const setTeamsAndTags = (payload: Partial<TeamsAndTags>): Action => ({
    type: ActionType.setTeamsAndTags,
    payload,
});
export const setSettings = (payload: Partial<Settings>): Action => ({
    type: ActionType.setSettings,
    payload,
});
export const setDisruptedSubs = (payload: Subscription[] | undefined): Action => ({
    type: ActionType.setDisruptedSubs,
    payload,
});

export type Action =
    | {
          type: ActionType.setIsLoading;
          payload: boolean;
      }
    | {
          type: ActionType.setShowSubCrashModal;
          payload: boolean;
      }
    | {
          type: ActionType.setError;
          payload: string | null;
      }
    | { type: ActionType.setTeamsAndTags; payload: Partial<TeamsAndTags> }
    | { type: ActionType.setSettings; payload: Partial<Settings> }
    | { type: ActionType.setDisruptedSubs; payload: Subscription[] | undefined };

const initialState: State = {
    isLoading: false,
    isShowSubCrashModal: false,
    error: null,
    teamsAndTags: undefined,
    settings: undefined,
    disruptedSubs: undefined,
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case ActionType.setIsLoading:
            return { ...state, isLoading: action.payload };
        case ActionType.setShowSubCrashModal:
            return { ...state, isShowSubCrashModal: action.payload };
        case ActionType.setError:
            return { ...state, error: action.payload };
        case ActionType.setTeamsAndTags:
            return {
                ...state,
                teamsAndTags: { ...state.teamsAndTags, ...action.payload } as TeamsAndTags,
            };
        case ActionType.setSettings:
            return { ...state, settings: { ...state.settings, ...action.payload } as Settings };
        case ActionType.setDisruptedSubs:
            return { ...state, disruptedSubs: action.payload };
        default:
            throw new Error(`Unknown action: ${JSON.stringify(action)}`);
    }
};

export const useSettingsContainerReducer = () => useReducer(reducer, initialState);
