import { configureStore } from "@reduxjs/toolkit";
import NotificationListContainerReducer from "./Reducers/NotificationListContainerReducer.slice";
import UIReducer from "./Reducers/UIReducer.slice";
import SettingsContainerReducer from "./Reducers/SettingsContainerReducer.slice";
import { configApi } from "../services/config";
import ConfigReducer from "./Reducers/ConfigReducer.slice";

export const store = configureStore({
    reducer: {
        [configApi.reducerPath]: configApi.reducer,
        ConfigReducer,
        NotificationListContainerReducer,
        UIReducer,
        SettingsContainerReducer,
    },

    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(configApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
