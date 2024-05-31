import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Config } from "../Domain/Config";

export const ConfigApi = createApi({
    reducerPath: "ConfigApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    endpoints: (builder) => ({
        getConfig: builder.query<Config, void>({
            query: () => ({ url: "config" }),
        }),
    }),
});

export const { useGetConfigQuery } = ConfigApi;
