import { SubscriptionCreateInfo } from "../Api/MoiraApi";
import { Subscription } from "../Domain/Subscription";
import { BaseApi, CustomBaseQueryArgs, TApiInvalidateTags } from "./BaseApi";

export const SubscriptionsApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        createUserSubscription: builder.mutation<
            Subscription,
            CustomBaseQueryArgs<SubscriptionCreateInfo>
        >({
            query: ({ handleLoadingLocally, handleErrorLocally, ...subscription }) => ({
                url: "subscription",
                method: "PUT",
                credentials: "same-origin",
                body: JSON.stringify(subscription),
            }),
        }),
        testSubscription: builder.mutation<void, CustomBaseQueryArgs<{ id: string }>>({
            query: ({ id }) => ({
                url: `subscription/${encodeURIComponent(id)}/test`,
                method: "PUT",
                credentials: "same-origin",
            }),
        }),
        updateSubscription: builder.mutation<Subscription, CustomBaseQueryArgs<Subscription>>({
            query: ({ handleLoadingLocally, handleErrorLocally, ...subscription }) => ({
                url: `subscription/${encodeURIComponent(subscription.id)}`,
                method: "PUT",
                credentials: "same-origin",
                body: JSON.stringify(subscription),
            }),
            invalidatesTags: (_result, error) => {
                if (error) {
                    return [];
                }
                return ["TagStats"];
            },
        }),
        deleteSubscription: builder.mutation<
            Subscription,
            CustomBaseQueryArgs<{ id: string; tagsToInvalidate?: TApiInvalidateTags[] }>
        >({
            query: ({ id }) => ({
                url: `subscription/${encodeURIComponent(id)}`,
                method: "DELETE",
                credentials: "same-origin",
            }),
            invalidatesTags: (_result, error, { tagsToInvalidate = [] }) => {
                if (error) {
                    return [];
                }
                return tagsToInvalidate;
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
