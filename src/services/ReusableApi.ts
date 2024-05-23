import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Config } from "../Domain/Config";
import { Settings } from "../Domain/Settings";

export const ReusableApi = createApi({
    reducerPath: "ReusableApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    endpoints: (builder) => ({
        getSettings: builder.query<Settings, void>({
            query: () => ({ url: "user/settings" }),
        }),
        getConfig: builder.query<Config, void>({
            query: () => ({ url: "config" }),
        }),
    }),
});

export const { useGetSettingsQuery, useGetConfigQuery } = ReusableApi;
