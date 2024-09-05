import { EventList } from "../Domain/Event";
import { Status } from "../Domain/Status";
import { Trigger, TriggerState } from "../Domain/Trigger";
import { BaseApi, CustomBaseQueryArgs } from "./BaseApi";

const eventHistoryPageSize = 100;

export const TriggerApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTriggerEvents: builder.query<
            EventList,
            CustomBaseQueryArgs<{
                triggerId: string;
                page: number;
                states?: Status[];
                metric?: string | null;
                from?: number | null;
                to?: number | null;
            }>
        >({
            query: ({ triggerId, page, states, metric, from, to }) => {
                const params = new URLSearchParams({
                    p: String(page),
                    size: String(eventHistoryPageSize),
                });

                if (states?.length) {
                    params.append("states", states.join(","));
                }
                if (metric) {
                    params.append("metric", metric);
                }
                if (from) {
                    params.append("from", String(from));
                }
                if (to) {
                    params.append("to", String(to));
                }

                return {
                    url: `event/${encodeURIComponent(triggerId)}?${params.toString()}`,
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
            CustomBaseQueryArgs<{ triggerId: string; maintenance: number }>
        >({
            query: ({ triggerId, maintenance }) => ({
                url: `trigger/${encodeURIComponent(triggerId)}/setMaintenance`,
                method: "PUT",
                credentials: "same-origin",
                body: JSON.stringify({ trigger: maintenance }),
            }),
            invalidatesTags: (_result, error) => {
                if (error) {
                    return [];
                }
                return ["TriggerState"];
            },
        }),

        setMetricsMaintenance: builder.mutation<
            void,
            CustomBaseQueryArgs<{
                triggerId: string;
                metrics: { [metric: string]: number };
            }>
        >({
            query: ({ triggerId, metrics }) => ({
                url: `trigger/${encodeURIComponent(triggerId)}/setMaintenance`,
                method: "PUT",
                credentials: "same-origin",
                body: JSON.stringify({ metrics }),
            }),
            invalidatesTags: (_result, error) => {
                if (error) {
                    return [];
                }
                return ["TriggerState"];
            },
        }),
        deleteMetric: builder.mutation<
            void,
            CustomBaseQueryArgs<{ triggerId: string; metric: string }>
        >({
            query: ({ triggerId, metric }) => ({
                url: `trigger/${encodeURIComponent(triggerId)}/metrics?name=${encodeURIComponent(
                    metric
                )}`,
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
        deleteTrigger: builder.mutation<void, CustomBaseQueryArgs<string>>({
            query: (triggerId) => ({
                url: `trigger/${encodeURIComponent(triggerId)}`,
                method: "DELETE",
                credentials: "same-origin",
            }),
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
} = TriggerApi;
