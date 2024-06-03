import { BaseApi } from "./BaseApi";
import { IUser } from "../Domain/User";

export const UserApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query<IUser, void>({
            query: () => ({ url: "user" }),
        }),
    }),
});

export const { useGetUserQuery } = UserApi;
