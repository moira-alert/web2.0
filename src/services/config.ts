import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Config } from "../Domain/Config";

export const configApi = createApi({
    reducerPath: "configApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/" }),
    endpoints: (builder) => ({
        getConfig: builder.query<Config, void>({
            query: () => ({ url: "api/config" }),
        }),
    }),
});

export const { useGetConfigQuery } = configApi;
