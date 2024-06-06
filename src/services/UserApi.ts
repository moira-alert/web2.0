import { BaseApi } from "./BaseApi";
import { User } from "../Domain/User";
import { Settings } from "../Domain/Settings";

export const UserApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query<User, void>({
            query: () => ({ url: "user", method: "GET" }),
        }),
        getUserSettings: builder.query<Settings, void>({
            query: () => ({ url: "/user/settings", method: "GET" }),
            providesTags: ["Settings"],
        }),
    }),
});

export const { useGetUserQuery, useGetUserSettingsQuery } = UserApi;
