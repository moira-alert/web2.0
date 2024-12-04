import { SubscriptionCreateInfo } from "../Domain/Subscription";
import { Contact, TeamContactCreateInfo } from "../Domain/Contact";
import { Settings } from "../Domain/Settings";
import { Subscription } from "../Domain/Subscription";
import { ITeamList, Team } from "../Domain/Team";
import { BaseApi, CustomBaseQueryArgs, TApiInvalidateTags } from "./BaseApi";
import qs from "qs";

const ALL_TEAMS_LIST_SIZE = 30;

export const TeamsApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTeamSettings: builder.query<Settings, CustomBaseQueryArgs<{ teamId: string }>>({
            query: ({ teamId }) => ({
                url: `teams/${encodeURIComponent(teamId)}/settings`,
                method: "GET",
                credentials: "same-origin",
            }),
            providesTags: ["TeamSettings"],
        }),
        getUserTeams: builder.query<Team[], CustomBaseQueryArgs | void>({
            query: () => ({
                url: "teams",
                method: "GET",
                credentials: "same-origin",
            }),
            transformResponse: (response: { teams: Team[] }) => response.teams,
            providesTags: ["UserTeams"],
        }),
        createTeamContact: builder.mutation<Contact, CustomBaseQueryArgs<TeamContactCreateInfo>>({
            query: ({ teamId, handleErrorLocally, handleLoadingLocally, ...contact }) => ({
                url: `teams/${encodeURIComponent(teamId)}/contacts`,
                method: "POST",
                credentials: "same-origin",
                body: JSON.stringify(contact),
            }),
        }),
        createTeamSubscription: builder.mutation<
            Subscription,
            CustomBaseQueryArgs<SubscriptionCreateInfo & { teamId: string }>
        >({
            query: ({ teamId, handleErrorLocally, handleLoadingLocally, ...subscription }) => ({
                url: `teams/${encodeURIComponent(teamId)}/subscriptions`,
                method: "POST",
                credentials: "same-origin",
                body: JSON.stringify(subscription),
            }),
        }),
        getTeam: builder.query<Team, CustomBaseQueryArgs<string>>({
            query: (teamId) => ({
                url: `teams/${encodeURIComponent(teamId)}`,
                method: "GET",
                credentials: "same-origin",
            }),
            providesTags: (_result, error, teamId) => {
                if (error) {
                    return [];
                }
                return [{ type: "Team", id: teamId }];
            },
        }),
        addTeam: builder.mutation<{ id: string }, CustomBaseQueryArgs<Partial<Team>>>({
            query: ({ id, handleErrorLocally, handleLoadingLocally, ...team }) => ({
                url: "teams",
                method: "POST",
                credentials: "same-origin",
                body: JSON.stringify(team),
            }),
            invalidatesTags: (_result, error) => {
                if (error) {
                    return [];
                }
                return ["UserTeams"];
            },
        }),
        updateTeam: builder.mutation<{ id: string }, CustomBaseQueryArgs<Team>>({
            query: ({ id, handleErrorLocally, handleLoadingLocally, ...team }) => ({
                url: `teams/${encodeURIComponent(id)}`,
                method: "PATCH",
                credentials: "same-origin",
                body: JSON.stringify(team),
            }),
            invalidatesTags: (_result, error, { id }) => {
                if (error) {
                    return [];
                }
                return ["UserTeams", { type: "Team", id }, "AllTeams"];
            },
        }),
        deleteTeam: builder.mutation<void, CustomBaseQueryArgs<{ teamId: string }>>({
            query: ({ teamId }) => ({
                url: `teams/${encodeURIComponent(teamId)}`,
                method: "DELETE",
                credentials: "same-origin",
            }),
            invalidatesTags: (_result, error) => {
                if (error) {
                    return [];
                }
                return ["UserTeams", "AllTeams"];
            },
        }),
        getTeamUsers: builder.query<string[], CustomBaseQueryArgs<{ teamId: string }>>({
            query: ({ teamId }) => ({
                url: `teams/${encodeURIComponent(teamId)}/users`,
                method: "GET",
                credentials: "same-origin",
            }),
            transformResponse: (response: { usernames: string[] }) => response.usernames,
            providesTags: ["TeamUsers"],
        }),
        addUserToTeam: builder.mutation<
            void,
            CustomBaseQueryArgs<{ teamId: string; userName: string }>
        >({
            query: ({ teamId, userName }) => ({
                url: `teams/${encodeURIComponent(teamId)}/users`,
                method: "POST",
                credentials: "same-origin",
                body: JSON.stringify({ usernames: [userName] }),
            }),
            invalidatesTags: (_result, error) => {
                if (error) {
                    return [];
                }
                return ["TeamUsers"];
            },
        }),
        deleteUserFromTeam: builder.mutation<
            void,
            CustomBaseQueryArgs<{
                teamId: string;
                userName: string;
                tagsToInvalidate?: TApiInvalidateTags[];
            }>
        >({
            query: ({ teamId, userName }) => ({
                url: `teams/${encodeURIComponent(teamId)}/users/${encodeURIComponent(userName)}`,
                method: "DELETE",
                credentials: "same-origin",
            }),
            invalidatesTags: (_result, error, { tagsToInvalidate = [] }) => {
                if (error) {
                    return [];
                }
                return tagsToInvalidate;
            },
        }),
        getAllTeams: builder.query<
            ITeamList,
            CustomBaseQueryArgs<{
                page: number;
                searchText?: string | null;
                sort?: "asc" | "desc" | null;
            }>
        >({
            query: ({ page, searchText, sort }) => {
                const params = qs.stringify(
                    {
                        p: page,
                        size: ALL_TEAMS_LIST_SIZE,
                        searchText,
                        sort,
                    },
                    { arrayFormat: "comma", skipNulls: true }
                );
                return {
                    url: `teams/all?${params}`,
                    method: "GET",
                    credentials: "same-origin",
                };
            },
            providesTags: (_result, error) => {
                if (error) {
                    return [];
                }
                return ["AllTeams"];
            },
        }),
    }),
});

export const {
    useGetTeamSettingsQuery,
    useLazyGetTeamSettingsQuery,
    useGetUserTeamsQuery,
    useCreateTeamContactMutation,
    useCreateTeamSubscriptionMutation,
    useGetTeamQuery,
    useAddTeamMutation,
    useUpdateTeamMutation,
    useDeleteTeamMutation,
    useGetTeamUsersQuery,
    useAddUserToTeamMutation,
    useDeleteUserFromTeamMutation,
    useGetAllTeamsQuery,
} = TeamsApi;
