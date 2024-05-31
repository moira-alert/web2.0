import { configureStore } from "@reduxjs/toolkit";
import NotificationListContainerReducer from "./Reducers/NotificationListContainerReducer.slice";
import UIReducer from "./Reducers/UIReducer.slice";
import SettingsContainerReducer from "./Reducers/SettingsContainerReducer.slice";
import { ConfigApi } from "../services/ConfigApi";
import ConfigReducer from "./Reducers/ConfigReducer.slice";
import { UserApi } from "../services/UserApi";

export const store = configureStore({
    reducer: {
        [ConfigApi.reducerPath]: ConfigApi.reducer,
        [UserApi.reducerPath]: UserApi.reducer,
        ConfigReducer,
        NotificationListContainerReducer,
        UIReducer,
        SettingsContainerReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(ConfigApi.middleware, UserApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
