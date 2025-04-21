import { NotifierState } from "../Domain/MoiraServiceStates";
import { BaseApi, CustomBaseQueryArgs } from "./BaseApi";

export const NotifierApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getNotifierState: builder.query<NotifierState, CustomBaseQueryArgs | void>({
            query: () => ({
                url: "health/notifier",
                method: "GET",
                credentials: "same-origin",
            }),
            providesTags: ["NotifierState"],
        }),
        setNotifierState: builder.mutation<NotifierState, CustomBaseQueryArgs<NotifierState>>({
            query: (state) => ({
                url: "health/notifier",
                method: "PUT",
                credentials: "same-origin",
                body: JSON.stringify(state),
            }),
            invalidatesTags: (_result, error) => {
                if (error) {
                    return [];
                }
                return ["NotifierState", "Notifications"];
            },
        }),
    }),
});

export const { useGetNotifierStateQuery, useSetNotifierStateMutation } = NotifierApi;
