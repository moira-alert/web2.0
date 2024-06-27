import { createEntityAdapter, createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseApi } from "../../services/BaseApi";
import { Config, ContactConfig } from "../../Domain/Config";
import { RootState } from "../store";

const contactsConfigAdapter = createEntityAdapter({
    selectId: (contactConfig: ContactConfig) => contactConfig.type,
});

const initialState = contactsConfigAdapter.getInitialState({
    config: null as Config | null,
});

const configSlice = createSlice({
    name: "config",
    initialState,
    reducers: {
        setConfig(state, action: PayloadAction<Config>) {
            state.config = action.payload;
        },
        setContactItems(state, action: PayloadAction<ContactConfig[]>) {
            contactsConfigAdapter.setAll(state, action.payload);
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(BaseApi.endpoints.getConfig.matchFulfilled, (state, { payload }) => {
            contactsConfigAdapter.upsertMany(state, payload.contacts);
            state.config = payload;
        });
    },
});

export default configSlice.reducer;
export const { setConfig, setContactItems } = configSlice.actions;

export const {
    selectById: selectContactConfigByType,
    selectIds: selectContactConfigIds,
    selectEntities: selectContactConfigEntities,
    selectAll: selectAllContactConfigs,
    selectTotal: selectTotalContactConfigs,
} = contactsConfigAdapter.getSelectors((state: RootState) => state.ConfigReducer);

export const selectContactConfigItems = createSelector(selectContactConfigEntities, (entities) =>
    Object.values(entities).map((contact) => [contact.type, contact.label] as [string, string])
);

export const selectIsPlottingDefaultOn = createSelector(
    (state: RootState) => state.ConfigReducer.config,
    (config) =>
        !!config?.featureFlags.isPlottingDefaultOn && config.featureFlags.isPlottingAvailable
);
