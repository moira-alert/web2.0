import { configureStore } from "@reduxjs/toolkit";
import NotificationListContainerReducer from "./Reducers/NotificationListContainerReducer.slice";
import UIReducer from "./Reducers/UIReducer.slice";
import { BaseApi } from "../services/BaseApi";
import ConfigReducer from "./Reducers/ConfigReducer.slice";
import { rtkQueryErrorAndLoadingHandler } from "../services/rtkQueryErrorAndLoadingHandler";

export const store = configureStore({
    reducer: {
        [BaseApi.reducerPath]: BaseApi.reducer,
        ConfigReducer,
        NotificationListContainerReducer,
        UIReducer,
    },

    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(BaseApi.middleware, rtkQueryErrorAndLoadingHandler),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
