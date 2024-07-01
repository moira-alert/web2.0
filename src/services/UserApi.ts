import { BaseApi, CustomBaseQueryArgs } from "./BaseApi";
import { IUser } from "../Domain/User";
import { Settings } from "../Domain/Settings";

export const UserApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query<IUser, CustomBaseQueryArgs | void>({
            query: () => ({ url: "user", method: "GET", credentials: "same-origin" }),
        }),
        getUserSettings: builder.query<Settings, CustomBaseQueryArgs | void>({
            query: () => ({
                url: "/user/settings",
                method: "GET",
                credentials: "same-origin",
            }),
            providesTags: ["UserSettings"],
        }),
    }),
});

export const { useGetUserQuery, useGetUserSettingsQuery } = UserApi;
