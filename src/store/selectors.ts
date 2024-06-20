import { RootState } from "./store";

export const NotificationsState = (state: RootState) => state.NotificationListContainerReducer;
export const UIState = (state: RootState) => state.UIReducer;
export const ConfigState = (state: RootState) => state.ConfigReducer;
