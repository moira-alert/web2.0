import { BaseApi, CustomBaseQueryArgs } from "./BaseApi";
import { TagList, TagStatList, TagStat } from "../Domain/Tag";

export const TagsApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTags: builder.query<string[], CustomBaseQueryArgs | void>({
            query: () => ({ url: "tag", method: "GET", credentials: "same-origin" }),
            transformResponse: (response: TagList) => response.list,
        }),
        getSystemTags: builder.query<string[], CustomBaseQueryArgs | void>({
            query: () => ({ url: "system-tag", method: "GET", credentials: "same-origin" }),
            transformResponse: (response: TagList) => response.list,
        }),
        getTagStats: builder.query<Array<TagStat>, CustomBaseQueryArgs | void>({
            query: () => ({ url: "tag/stats", method: "GET", credentials: "same-origin" }),
            providesTags: ["TagStats"],
            transformResponse: (response: TagStatList) => response.list,
        }),
        deleteTag: builder.mutation<void, CustomBaseQueryArgs<string>>({
            query: (tag) => ({
                url: `tag/${encodeURIComponent(tag)}`,
                method: "DELETE",
                credentials: "same-origin",
            }),
            invalidatesTags: (_result, error) => (error ? [] : ["TagStats"]),
        }),
    }),
});

export const {
    useGetTagsQuery,
    useGetSystemTagsQuery,
    useGetTagStatsQuery,
    useDeleteTagMutation,
} = TagsApi;
