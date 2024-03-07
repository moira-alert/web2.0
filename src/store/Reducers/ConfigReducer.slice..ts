import { createSlice } from "@reduxjs/toolkit";
import { configApi } from "../../services/config";
import { Config } from "../../Domain/Config";

const configSlice = createSlice({
    name: "config",
    initialState: { config: null as Config | null },
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(configApi.endpoints.getConfig.matchFulfilled, (state, { payload }) => {
            state.config = payload;
        });
    },
});

export default configSlice.reducer;
