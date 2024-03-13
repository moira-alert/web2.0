import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Notification } from "../../Domain/Notification";

interface INotificationListContainerState {
    notificationList: Notification[];
    notifierEnabled: boolean;
}

const initialState: INotificationListContainerState = {
    notificationList: [],
    notifierEnabled: true,
};

const NotificationSlice = createSlice({
    name: "notifications",
    initialState,
    reducers: {
        setNotificationList: (state, action: PayloadAction<Notification[]>) => {
            state.notificationList = action.payload;
        },
        setNotifierEnabled: (state, action: PayloadAction<boolean>) => {
            state.notifierEnabled = action.payload;
        },
        deleteNotification: (state, action: PayloadAction<string>) => {
            state.notificationList = state.notificationList.filter(
                (item) => item.timestamp + item.contact.id + item.event.sub_id !== action.payload
            );
        },
        deleteAllNotifications: (state) => {
            state.notificationList = [];
        },
    },
});

export const {
    setNotificationList,
    setNotifierEnabled,
    deleteNotification,
    deleteAllNotifications,
} = NotificationSlice.actions;

export default NotificationSlice.reducer;
