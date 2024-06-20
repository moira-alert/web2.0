import { BaseApi } from "./BaseApi";
import { IUser } from "../Domain/User";
import { Settings } from "../Domain/Settings";

export const UserApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query<IUser, void>({
            query: () => ({ url: "user", method: "GET" }),
        }),
        getUserSettings: builder.query<Settings, void>({
            query: () => ({ url: "/user/settings", method: "GET" }),
            providesTags: ["UserSettings"],
        }),
    }),
});

export const { useGetUserQuery, useGetUserSettingsQuery } = UserApi;
