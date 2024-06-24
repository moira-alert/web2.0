import { SubscriptionCreateInfo } from "../Api/MoiraApi";
import { Contact, TeamContactCreateInfo } from "../Domain/Contact";
import { Settings } from "../Domain/Settings";
import { Subscription } from "../Domain/Subscription";
import { Team } from "../Domain/Team";
import { BaseApi, CustomBaseQueryArgs } from "./BaseApi";

export const TeamsApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTeamSettings: builder.query<Settings, CustomBaseQueryArgs<string>>({
            query: (teamId) => ({
                url: `teams/${encodeURIComponent(teamId)}/settings`,
                method: "GET",
                credentials: "same-origin",
            }),
            providesTags: ["TeamSettings"],
        }),
        getUserTeams: builder.query<{ teams: Team[] }, CustomBaseQueryArgs | void>({
            query: () => ({
                url: "teams",
                method: "GET",
                credentials: "same-origin",
            }),
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
    }),
});

export const {
    useGetTeamSettingsQuery,
    useGetUserTeamsQuery,
    useCreateTeamContactMutation,
    useCreateTeamSubscriptionMutation,
} = TeamsApi;
