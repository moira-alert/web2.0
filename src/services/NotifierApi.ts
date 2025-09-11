import MoiraServiceStates, {
    NotifierSourceState,
    NotifierState,
} from "../Domain/MoiraServiceStates";
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
        setNotifierState: builder.mutation<
            NotifierState,
            CustomBaseQueryArgs<Omit<NotifierState, "actor">>
        >({
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
        getNotifierSourcesState: builder.query<NotifierSourceState[], void>({
            query: () => ({
                url: "health/notifier-sources",
                method: "GET",
                credentials: "same-origin",
            }),
            transformResponse: (response: { sources: NotifierSourceState[] }) => response.sources,
            providesTags: ["NotifierSourcesState"],
        }),
        setNotifierSourceState: builder.mutation<
            NotifierState,
            CustomBaseQueryArgs<{
                triggerSource: string;
                clusterId: string;
                state: MoiraServiceStates;
            }>
        >({
            query: ({ state, triggerSource, clusterId }) => ({
                url: `health/notifier-sources/${triggerSource}/${clusterId}`,
                method: "PUT",
                credentials: "same-origin",
                body: JSON.stringify({ state }),
            }),
            invalidatesTags: (_result, error) => {
                if (error) {
                    return [];
                }
                return ["NotifierState", "NotifierSourcesState", "Notifications"];
            },
        }),
    }),
});

export const {
    useGetNotifierStateQuery,
    useSetNotifierStateMutation,
    useGetNotifierSourcesStateQuery,
    useSetNotifierSourceStateMutation,
} = NotifierApi;
