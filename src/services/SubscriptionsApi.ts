import { SubscriptionCreateInfo } from "../Api/MoiraApi";
import { Subscription } from "../Domain/Subscription";
import { BaseApi } from "./BaseApi";

export const SubscriptionsApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        createUserSubscription: builder.mutation<Subscription, SubscriptionCreateInfo>({
            query: (subscription) => ({
                url: "subscription",
                method: "PUT",
                body: JSON.stringify(subscription),
            }),
            invalidatesTags: ["UserSettings"],
        }),
        testSubscription: builder.mutation<void, string>({
            query: (subscriptionId) => ({
                url: `subscription/${encodeURIComponent(subscriptionId)}/test`,
                method: "PUT",
            }),
        }),
        updateSubscription: builder.mutation<
            Subscription,
            Subscription & { isTeamSubscription?: boolean }
        >({
            query: (subscription) => ({
                url: `subscription/${encodeURIComponent(subscription.id)}`,
                method: "PUT",
                body: JSON.stringify(subscription),
            }),
            invalidatesTags: (_result, error, { isTeamSubscription }) => {
                if (error) {
                    return [];
                }
                if (isTeamSubscription) {
                    return ["TeamSettings", "TagStats"];
                } else {
                    return ["UserSettings", "TagStats"];
                }
            },
        }),
        deleteSubscription: builder.mutation<
            Subscription,
            { id: string; isTeamSubscription?: boolean }
        >({
            query: ({ id }) => ({
                url: `subscription/${encodeURIComponent(id)}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, error, { isTeamSubscription }) => {
                if (error) {
                    return [];
                }
                if (isTeamSubscription) {
                    return ["TeamSettings", "TagStats"];
                } else {
                    return ["UserSettings", "TagStats"];
                }
            },
        }),
    }),
});

export const {
    useCreateUserSubscriptionMutation,
    useTestSubscriptionMutation,
    useUpdateSubscriptionMutation,
    useDeleteSubscriptionMutation,
} = SubscriptionsApi;
