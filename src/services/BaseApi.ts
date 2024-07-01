import {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError,
    createApi,
    fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";
import type { Config } from "../Domain/Config";

interface IApiError {
    error?: string;
    status: string;
}

export type CustomBaseQueryArgs<T = object> = T & {
    handleLoadingLocally?: boolean;
    handleErrorLocally?: boolean;
};

const isErrorWithMessage = (error: unknown): error is { message: string } => {
    return (
        typeof error === "object" &&
        error != null &&
        "message" in error &&
        typeof (error as { message: unknown }).message === "string"
    );
};

const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
    return typeof error === "object" && error != null && "status" in error;
};

const customFetchBaseQuery: BaseQueryFn<string | FetchArgs, unknown, unknown, object> = async (
    args,
    api,
    extraOptions
) => {
    const result = await fetchBaseQuery({ baseUrl: "/api" })(args, api, extraOptions);
    if (!result.error) {
        return result;
    }
    const error = result.error;

    if (isFetchBaseQueryError(error)) {
        const errorData = error.data as IApiError;
        const errMsg =
            "error" in error
                ? error.status + ` : ${error.error}`
                : error.status +
                  ("error" in errorData
                      ? ` : ${errorData.status}, ${errorData.error}`
                      : ` : ${errorData.status}`);
        return { error: errMsg };
    }

    if (isErrorWithMessage(result.error)) {
        return { error: result.error.message };
    }

    return { error: JSON.stringify(result.error.data) };
};

export const BaseApi = createApi({
    reducerPath: "BaseApi",
    tagTypes: ["Contacts", "UserSettings", "TeamSettings", "TagStats"],
    baseQuery: customFetchBaseQuery,
    endpoints: (builder) => ({
        getConfig: builder.query<Config, void>({
            query: () => ({ url: "config", credentials: "same-origin" }),
        }),
    }),
});

export const { useGetConfigQuery } = BaseApi;
