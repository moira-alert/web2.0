import { configureStore } from "@reduxjs/toolkit";
import NotificationListContainerReducer from "./Reducers/NotificationListContainerReducer.slice";
import UIReducer from "./Reducers/UIReducer.slice";
import SettingsContainerReducer from "./Reducers/SettingsContainerReducer.slice";
import { BaseApi } from "../services/BaseApi";
import ConfigReducer from "./Reducers/ConfigReducer.slice";

export const store = configureStore({
    reducer: {
        [BaseApi.reducerPath]: BaseApi.reducer,
        ConfigReducer,
        NotificationListContainerReducer,
        UIReducer,
        SettingsContainerReducer,
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(BaseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
