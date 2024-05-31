import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "../Domain/User";

export const UserApi = createApi({
    reducerPath: "UserApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    endpoints: (builder) => ({
        getUser: builder.query<User, void>({
            query: () => ({ url: "user" }),
        }),
    }),
});

export const { useGetUserQuery } = UserApi;
