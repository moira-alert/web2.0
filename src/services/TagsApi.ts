import { BaseApi, CustomBaseQueryArgs } from "./BaseApi";
import { TagList, TagStatList } from "../Api/MoiraApi";
import { TagStat } from "../Domain/Tag";

export const TagsApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTags: builder.query<TagList, CustomBaseQueryArgs | void>({
            query: () => ({ url: "tag", method: "GET", credentials: "same-origin" }),
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

export const { useGetTagsQuery, useGetTagStatsQuery, useDeleteTagMutation } = TagsApi;
