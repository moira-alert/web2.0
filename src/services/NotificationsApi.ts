import { NotificationList } from "../Domain/Notification";
import { BaseApi, CustomBaseQueryArgs } from "./BaseApi";

export const NotificationsApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getNotifications: builder.query<NotificationList, CustomBaseQueryArgs | void>({
            query: () => ({
                url: "notification?start=0&end=-1",
                method: "GET",
                credentials: "same-origin",
            }),
            providesTags: ["Notifications"],
        }),

        deleteNotification: builder.mutation<void, CustomBaseQueryArgs<{ id: string }>>({
            query: ({ id }) => ({
                url: `notification?id=${encodeURIComponent(id)}`,
                credentials: "same-origin",
                method: "DELETE",
            }),
            invalidatesTags: (_result, error) => {
                if (error) {
                    return [];
                }
                return ["Notifications"];
            },
        }),
        deleteAllNotifications: builder.mutation<void, CustomBaseQueryArgs | void>({
            query: () => ({
                url: "notification/all",
                credentials: "same-origin",
                method: "DELETE",
            }),
            invalidatesTags: (_result, error) => {
                if (error) {
                    return [];
                }
                return ["Notifications"];
            },
        }),
        deleteAllNotificationEvents: builder.mutation<void, CustomBaseQueryArgs | void>({
            query: () => ({
                url: "event/all",
                credentials: "same-origin",
                method: "DELETE",
            }),
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useDeleteNotificationMutation,
    useDeleteAllNotificationsMutation,
    useDeleteAllNotificationEventsMutation,
} = NotificationsApi;