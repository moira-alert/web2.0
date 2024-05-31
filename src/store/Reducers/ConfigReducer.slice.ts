import { createSlice } from "@reduxjs/toolkit";
import { BaseApi } from "../../services/BaseApi";
import { Config } from "../../Domain/Config";

const configSlice = createSlice({
    name: "config",
    initialState: { config: null as Config | null },
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(BaseApi.endpoints.getConfig.matchFulfilled, (state, { payload }) => {
            state.config = payload;
        });
    },
});

export default configSlice.reducer;
