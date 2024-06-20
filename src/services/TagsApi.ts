import { BaseApi } from "./BaseApi";
import { TagList, TagStatList } from "../Api/MoiraApi";
import { TagStat } from "../Domain/Tag";

export const TagsApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTags: builder.query<TagList, void>({
            query: () => ({ url: "tag", method: "GET" }),
        }),
        getTagStats: builder.query<Array<TagStat>, void>({
            query: () => ({ url: "tag/stats", method: "GET" }),
            providesTags: ["TagStats"],
            transformResponse: (response: TagStatList) => response.list,
        }),
        deleteTag: builder.mutation<void, string>({
            query: (tag) => ({ url: `tag/${encodeURIComponent(tag)}`, method: "DELETE" }),
            invalidatesTags: (_result, error) => (error ? [] : ["TagStats"]),
        }),
    }),
});

export const { useGetTagsQuery, useGetTagStatsQuery, useDeleteTagMutation } = TagsApi;
