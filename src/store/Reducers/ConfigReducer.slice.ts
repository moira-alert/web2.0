import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BaseApi } from "../../services/BaseApi";
import { Config } from "../../Domain/Config";

const configSlice = createSlice({
    name: "config",
    initialState: { config: null as Config | null },
    reducers: {
        setConfig(state, action: PayloadAction<Config>) {
            state.config = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addMatcher(BaseApi.endpoints.getConfig.matchFulfilled, (state, { payload }) => {
            state.config = payload;
        });
    },
});

export default configSlice.reducer;
export const { setConfig } = configSlice.actions;
