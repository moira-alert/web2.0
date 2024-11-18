import { Pattern, PatternList } from "../Domain/Pattern";
import { BaseApi, CustomBaseQueryArgs } from "./BaseApi";

export const PatternsApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getPatterns: builder.query<Array<Pattern>, CustomBaseQueryArgs | void>({
            query: () => ({
                url: "pattern",
                method: "GET",
                credentials: "same-origin",
            }),
            transformResponse: (response: PatternList) => response.list,
            providesTags: ["Patterns"],
        }),

        deletePattern: builder.mutation<void, CustomBaseQueryArgs<string>>({
            query: (pattern) => ({
                url: `pattern/${encodeURIComponent(pattern)}`,
                credentials: "same-origin",
                method: "DELETE",
            }),
            invalidatesTags: (_result, error) => {
                if (error) {
                    return [];
                }
                return ["Patterns"];
            },
        }),
    }),
});

export const { useGetPatternsQuery, useDeletePatternMutation } = PatternsApi;
