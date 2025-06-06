import { SubscriptionCreateInfo } from "../Domain/Subscription";
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
                return ["TagStats", "SystemSubscriptions"];
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
        getSystemSubscriptions: builder.query<Array<Subscription>, CustomBaseQueryArgs | void>({
            query: () => ({
                url: "health/system-subscriptions",
                method: "GET",
                credentials: "same-origin",
            }),
            providesTags: ["SystemSubscriptions"],
            transformResponse: (response: { list: Array<Subscription> }) => response.list,
        }),
    }),
});

export const {
    useCreateUserSubscriptionMutation,
    useTestSubscriptionMutation,
    useUpdateSubscriptionMutation,
    useDeleteSubscriptionMutation,
    useGetSystemSubscriptionsQuery,
} = SubscriptionsApi;
