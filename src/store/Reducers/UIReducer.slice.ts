import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Subscription } from "../../Domain/Subscription";
import { TriggerApi } from "../../services/TriggerApi";
import { EThemesNames } from "../../Themes/themesNames";

export enum EMainPageTriggerView {
    description = "description",
    target = "target",
}

interface IUIState {
    isLoading: boolean;
    error: string | null;
    isNewFrontendVersionAvailable: boolean;
    isTransferringSubscriptions: boolean;
    isEnablingSubscriptions: boolean;
    managingSubscriptions: Subscription[];
    isTransformNullApplied: boolean;
    isChristmasMood: boolean;
    theme: EThemesNames;
    mainPageTriggerView: EMainPageTriggerView;
}

const initialState: IUIState = {
    isLoading: false,
    error: null,
    isNewFrontendVersionAvailable: false,
    isTransferringSubscriptions: false,
    isEnablingSubscriptions: false,
    managingSubscriptions: [],
    isTransformNullApplied: false,
    isChristmasMood: false,
    theme: EThemesNames.System,
    mainPageTriggerView: EMainPageTriggerView.target,
};

export const UISlice = createSlice({
    name: "uiReducer",
    initialState,
    reducers: {
        toggleLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        updateServiceWorker: (state) => {
            state.isNewFrontendVersionAvailable = true;
        },
        setIsTransferingSubscriptions: (state, action: PayloadAction<boolean>) => {
            state.isTransferringSubscriptions = action.payload;
            state.isEnablingSubscriptions = false;
        },
        setManagingSubscriptions: (state, action: PayloadAction<Subscription[]>) => {
            state.managingSubscriptions = action.payload;
        },
        setIsEnablingSubscriptions: (state, action: PayloadAction<boolean>) => {
            state.isEnablingSubscriptions = action.payload;
            state.isTransferringSubscriptions = false;
        },
        toggleManagingSubscriptions: (state, action: PayloadAction<Subscription>) => {
            const existingIndex = state.managingSubscriptions.findIndex(
                (subscription) => subscription.id === action.payload.id
            );
            if (existingIndex !== -1) {
                state.managingSubscriptions.splice(existingIndex, 1);
            } else {
                state.managingSubscriptions.push(action.payload);
            }
        },
        toggleChristmasMood(state, action: PayloadAction<boolean>) {
            state.isChristmasMood = action.payload;
        },
        setTheme: (state, { payload }: { payload: EThemesNames }) => {
            state.theme = payload;
        },
        toggleMainPageTriggerView: (state, { payload }: { payload: EMainPageTriggerView }) => {
            state.mainPageTriggerView = payload;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(TriggerApi.endpoints.getTrigger.matchFulfilled, (state, { payload }) => {
            const hasTransformNull = payload.targets.some((target) =>
                target.includes("transformNull")
            );
            state.isTransformNullApplied = hasTransformNull;
        });
    },
});

export const {
    toggleLoading,
    setError,
    updateServiceWorker,
    setManagingSubscriptions,
    setIsTransferingSubscriptions,
    setIsEnablingSubscriptions,
    toggleManagingSubscriptions,
    toggleChristmasMood,
    setTheme,
    toggleMainPageTriggerView,
} = UISlice.actions;

export default UISlice.reducer;
