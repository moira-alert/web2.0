import { createSlice } from "@reduxjs/toolkit";
import { ReusableApi } from "../../services/ReusableApi";
import { Config } from "../../Domain/Config";

const configSlice = createSlice({
    name: "config",
    initialState: { config: null as Config | null },
    reducers: {},
    extraReducers: (builder) => {
        builder.addMatcher(ReusableApi.endpoints.getConfig.matchFulfilled, (state, { payload }) => {
            state.config = payload;
        });
    },
});

export default configSlice.reducer;
