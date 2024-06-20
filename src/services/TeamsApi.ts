import { SubscriptionCreateInfo } from "../Api/MoiraApi";
import { Contact } from "../Domain/Contact";
import { Settings } from "../Domain/Settings";
import { Subscription } from "../Domain/Subscription";
import { Team } from "../Domain/Team";
import { BaseApi } from "./BaseApi";

interface ContactCreateInfo {
    value: string;
    type: string;
    name?: string;
    teamId: string;
}

export const TeamsApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTeamSettings: builder.query<Settings, string>({
            query: (teamId) => ({
                url: `teams/${encodeURIComponent(teamId)}/settings`,
                method: "GET",
            }),
            providesTags: ["TeamSettings"],
        }),
        getUserTeams: builder.query<{ teams: Team[] }, void>({
            query: () => ({
                url: "teams",
                method: "GET",
            }),
        }),
        createTeamContact: builder.mutation<Contact, ContactCreateInfo>({
            query: ({ teamId, ...contact }) => ({
                url: `teams/${encodeURIComponent(teamId)}/contacts`,
                method: "POST",
                body: JSON.stringify(contact),
            }),
            invalidatesTags: ["TeamSettings"],
        }),
        createTeamSubscription: builder.mutation<
            Subscription,
            SubscriptionCreateInfo & { teamId: string }
        >({
            query: ({ teamId, ...subscription }) => ({
                url: `teams/${encodeURIComponent(teamId)}/subscriptions`,
                method: "POST",
                body: JSON.stringify(subscription),
            }),
            invalidatesTags: ["TeamSettings"],
        }),
    }),
});

export const {
    useGetTeamSettingsQuery,
    useGetUserTeamsQuery,
    useCreateTeamContactMutation,
    useCreateTeamSubscriptionMutation,
} = TeamsApi;
