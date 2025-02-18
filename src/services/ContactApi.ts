import {
    Contact,
    ContactList,
    ContactNoisinessResponse,
    IContactEvent,
    IContactEventsList,
} from "../Domain/Contact";
import { BaseApi } from "./BaseApi";
import type { CustomBaseQueryArgs, TApiInvalidateTags } from "./BaseApi";
import qs from "qs";

const contactNoisinessSize = 7;

export const ContactApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllContacts: builder.query<Array<Contact>, CustomBaseQueryArgs | void>({
            query: () => ({
                url: `contact`,
                method: "GET",
                credentials: "same-origin",
            }),
            transformResponse: (response: ContactList) => response.list,
            providesTags: ["Contacts"],
        }),
        updateContact: builder.mutation<
            Contact,
            CustomBaseQueryArgs<Partial<Contact> & Pick<Contact, "id">>
        >({
            query: ({ id, handleErrorLocally, handleLoadingLocally, ...contact }) => ({
                url: `contact/${id}`,
                method: "PUT",
                credentials: "same-origin",
                body: JSON.stringify(contact),
            }),
            invalidatesTags: (_result, error) => {
                if (error) {
                    return [];
                }
                return ["Contacts"];
            },
        }),
        testContact: builder.mutation<void, CustomBaseQueryArgs<{ id: string }>>({
            query: ({ id }) => ({
                url: `contact/${encodeURIComponent(id)}/test`,
                credentials: "same-origin",
                method: "POST",
            }),
        }),
        deleteContact: builder.mutation<
            void,
            CustomBaseQueryArgs<{ id: string; tagsToInvalidate?: TApiInvalidateTags[] }>
        >({
            query: ({ id }) => ({
                url: `contact/${id}`,
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
        createUserContact: builder.mutation<Contact, CustomBaseQueryArgs<Omit<Contact, "id">>>({
            query: ({ handleLoadingLocally, handleErrorLocally, ...contact }) => ({
                url: `contact`,
                method: "PUT",
                credentials: "same-origin",
                body: JSON.stringify(contact),
            }),
        }),
        getContactEvents: builder.query<
            Array<IContactEvent>,
            CustomBaseQueryArgs<{
                contactId: string;
                from: number | string | null;
                to: number | string | null;
            }>
        >({
            query: ({ contactId, from, to }) => ({
                url: `contact/${encodeURIComponent(contactId)}/events?from=${from}&to=${to}`,
                method: "GET",
                credentials: "same-origin",
            }),
            transformResponse: (response: IContactEventsList) => response.list,
        }),
        getContactNoisiness: builder.query<
            ContactNoisinessResponse,
            CustomBaseQueryArgs<{
                page?: number | null;
                from?: number | string | null;
                to?: number | string | null;
            }>
        >({
            query: ({ page, from, to }) => {
                const params = qs.stringify(
                    {
                        p: page,
                        size: contactNoisinessSize,
                        from,
                        to,
                    },
                    { arrayFormat: "indices", skipNulls: true, encode: true }
                );

                return {
                    url: `/contact/noisiness?${params}`,
                    method: "GET",
                    credentials: "same-origin",
                };
            },
        }),
    }),
});

export const {
    useUpdateContactMutation,
    useGetAllContactsQuery,
    useTestContactMutation,
    useDeleteContactMutation,
    useCreateUserContactMutation,
    useLazyGetContactEventsQuery,
    useLazyGetContactNoisinessQuery,
} = ContactApi;
