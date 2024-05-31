import { BaseApi } from "./BaseApi";
import { User } from "../Domain/User";

export const UserApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query<User, void>({
            query: () => ({ url: "user" }),
        }),
    }),
});

export const { useGetUserQuery } = UserApi;
