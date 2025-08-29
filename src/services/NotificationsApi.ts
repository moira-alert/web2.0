import { NotificationList } from "../Domain/Notification";
import { BaseApi, CustomBaseQueryArgs } from "./BaseApi";
import qs from "qs";

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
        deleteFilteredNotifications: builder.mutation<
            void,
            CustomBaseQueryArgs<{
                start: number;
                end: number;
                ignoredTags: Array<string>;
                clusterKeys?: Array<string>;
            }>
        >({
            query: ({ start, end, ignoredTags, clusterKeys }) => {
                const params = qs.stringify(
                    {
                        start,
                        end,
                        ignoredTags,
                        clusterKeys,
                    },
                    { arrayFormat: "indices", skipNulls: true, encode: true }
                );

                return {
                    url: `notification/filtered?${params}`,
                    credentials: "same-origin",
                    method: "DELETE",
                };
            },
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
    useDeleteFilteredNotificationsMutation,
} = NotificationsApi;
