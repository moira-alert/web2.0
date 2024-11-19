import { EventList } from "../Domain/Event";
import { Status } from "../Domain/Status";
import { Trigger, TriggerList, TriggerState, ValidateTargetsResult } from "../Domain/Trigger";
import { BaseApi, CustomBaseQueryArgs, TApiInvalidateTags } from "./BaseApi";
import qs from "qs";

const eventHistoryPageSize = 100;
const triggerListPageSize = 20;

export const TriggerApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTriggerEvents: builder.query<
            EventList,
            CustomBaseQueryArgs<{
                triggerId: string;
                page: number;
                states?: Status[];
                metric?: string;
                from?: number | null;
                to?: number | null;
            }>
        >({
            query: ({ triggerId, page, states, metric, from, to }) => {
                const params = qs.stringify(
                    {
                        p: page,
                        size: eventHistoryPageSize,
                        states: states?.length ? states : null,
                        metric,
                        from,
                        to,
                    },
                    { arrayFormat: "comma", skipNulls: true }
                );

                return {
                    url: `event/${encodeURIComponent(triggerId)}?${params}`,
                    method: "GET",
                    credentials: "same-origin",
                };
            },
        }),
        getTrigger: builder.query<
            Trigger,
            CustomBaseQueryArgs<{
                triggerId: string;
                populated?: boolean;
            }>
        >({
            query: ({ triggerId, populated }) => {
                const params = new URLSearchParams();
                if (populated !== undefined) {
                    params.append("populated", String(populated));
                }
                return {
                    url: `trigger/${encodeURIComponent(triggerId)}?${params.toString()}`,
                    method: "GET",
                    credentials: "same-origin",
                };
            },
            providesTags: ["Trigger"],
        }),
        getTriggerState: builder.query<TriggerState, CustomBaseQueryArgs<string>>({
            query: (triggerId) => ({
                url: `trigger/${encodeURIComponent(triggerId)}/state`,
                method: "GET",
                credentials: "same-origin",
            }),
            providesTags: ["TriggerState"],
        }),
        deleteTriggerThrottling: builder.mutation<void, CustomBaseQueryArgs<string>>({
            query: (triggerId) => ({
                url: `trigger/${encodeURIComponent(triggerId)}/throttling`,
                method: "DELETE",
                credentials: "same-origin",
            }),
            invalidatesTags: (_result, error) => {
                if (error) {
                    return [];
                }
                return ["Trigger"];
            },
        }),
        setTriggerMaintenance: builder.mutation<
            void,
            CustomBaseQueryArgs<{
                triggerId: string;
                maintenance: number;
                tagsToInvalidate?: TApiInvalidateTags[];
            }>
        >({
            query: ({ triggerId, maintenance }) => ({
                url: `trigger/${encodeURIComponent(triggerId)}/setMaintenance`,
                method: "PUT",
                credentials: "same-origin",
                body: JSON.stringify({ trigger: maintenance }),
            }),
            invalidatesTags: (_result, error, { tagsToInvalidate = [] }) => {
                if (error) {
                    return [];
                }
                return tagsToInvalidate;
            },
        }),
        setMetricsMaintenance: builder.mutation<
            void,
            CustomBaseQueryArgs<{
                triggerId: string;
                metrics: { [metric: string]: number };
                tagsToInvalidate?: TApiInvalidateTags[];
            }>
        >({
            query: ({ triggerId, metrics }) => ({
                url: `trigger/${encodeURIComponent(triggerId)}/setMaintenance`,
                method: "PUT",
                credentials: "same-origin",
                body: JSON.stringify({ metrics }),
            }),
            invalidatesTags: (_result, error, { tagsToInvalidate = [] }) => {
                if (error) {
                    return [];
                }
                return tagsToInvalidate;
            },
        }),
        deleteMetric: builder.mutation<
            void,
            CustomBaseQueryArgs<{
                triggerId: string;
                metric: string;
                tagsToInvalidate?: TApiInvalidateTags[];
            }>
        >({
            query: ({ triggerId, metric }) => ({
                url: `trigger/${encodeURIComponent(triggerId)}/metrics?name=${encodeURIComponent(
                    metric
                )}`,
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
        deleteTrigger: builder.mutation<void, CustomBaseQueryArgs<string>>({
            query: (triggerId) => ({
                url: `trigger/${encodeURIComponent(triggerId)}`,
                method: "DELETE",
                credentials: "same-origin",
            }),
            invalidatesTags: (_result, error) => {
                if (error) {
                    return [];
                }
                return ["TriggerList"];
            },
        }),
        deleteNoDataMetric: builder.mutation<void, CustomBaseQueryArgs<string>>({
            query: (triggerId) => ({
                url: `trigger/${encodeURIComponent(triggerId)}/metrics/nodata`,
                method: "DELETE",
                credentials: "same-origin",
            }),
            invalidatesTags: (_result, error) => {
                if (error) {
                    return [];
                }
                return ["TriggerState"];
            },
        }),
        validateTarget: builder.mutation<
            ValidateTargetsResult,
            CustomBaseQueryArgs<Partial<Trigger>>
        >({
            query: (trigger) => ({
                url: "trigger/check",
                method: "PUT",
                body: JSON.stringify(trigger),
                credentials: "same-origin",
            }),
        }),
        setTrigger: builder.mutation<
            {
                [key: string]: string;
            },
            CustomBaseQueryArgs<{ id: string; data: Partial<Trigger> }>
        >({
            query: ({ id, data }) => ({
                url: `trigger/${encodeURIComponent(id)}`,
                method: "PUT",
                body: JSON.stringify(data),
                credentials: "same-origin",
            }),
        }),
        addTrigger: builder.mutation<
            {
                [key: string]: string;
            },
            CustomBaseQueryArgs<Partial<Trigger>>
        >({
            query: (data) => ({
                url: "trigger",
                method: "PUT",
                body: JSON.stringify(data),
                credentials: "same-origin",
            }),
        }),
        getTriggerList: builder.query<
            TriggerList,
            CustomBaseQueryArgs<{
                page: number;
                onlyProblems: boolean;
                tags?: Array<string>;
                searchText?: string;
            }>
        >({
            query: ({ page, onlyProblems, tags = [], searchText = "" }) => {
                const params = qs.stringify(
                    {
                        p: page,
                        size: triggerListPageSize,
                        tags,
                        onlyProblems,
                        text: searchText,
                    },
                    { arrayFormat: "indices", skipNulls: true, encode: true }
                );

                return {
                    url: `/trigger/search?${params}`,
                    method: "GET",
                    credentials: "same-origin",
                };
            },
            providesTags: ["TriggerList"],
        }),
    }),
});

export const {
    useGetTriggerEventsQuery,
    useDeleteMetricMutation,
    useDeleteNoDataMetricMutation,
    useDeleteTriggerMutation,
    useDeleteTriggerThrottlingMutation,
    useGetTriggerQuery,
    useGetTriggerStateQuery,
    useSetMetricsMaintenanceMutation,
    useSetTriggerMaintenanceMutation,
    useValidateTargetMutation,
    useSetTriggerMutation,
    useAddTriggerMutation,
    useGetTriggerListQuery,
} = TriggerApi;
