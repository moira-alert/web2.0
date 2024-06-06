import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Config } from "../Domain/Config";

export const BaseApi = createApi({
    reducerPath: "BaseApi",
    tagTypes: ["Contact", "Settings"],
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    endpoints: (builder) => ({
        getConfig: builder.query<Config, void>({
            query: () => ({ url: "config", credentials: "same-origin" }),
        }),
    }),
});

export const { useGetConfigQuery } = BaseApi;
