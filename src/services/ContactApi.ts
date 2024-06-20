import { Contact, ContactList } from "../Domain/Contact";
import { BaseApi } from "./BaseApi";

export const ContactApi = BaseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllContacts: builder.query<Array<Contact>, void>({
            query: () => ({
                url: `contact`,
                method: "GET",
            }),
            transformResponse: (response: ContactList) => response.list,
            providesTags: ["Contacts"],
        }),
        updateContact: builder.mutation<
            Contact,
            Partial<Contact> & Pick<Contact, "id"> & { isTeamContact?: boolean }
        >({
            query: ({ id, ...contact }) => ({
                url: `contact/${id}`,
                method: "PUT",
                body: contact,
            }),
            invalidatesTags: (_result, _error, { isTeamContact }) => {
                if (isTeamContact) {
                    return ["Contacts", "TeamSettings"];
                } else {
                    return ["Contacts", "UserSettings"];
                }
            },
        }),
        testContact: builder.mutation<void, string>({
            query: (id) => ({
                url: `contact/${id}/test`,
                method: "POST",
            }),
        }),
        deleteContact: builder.mutation<void, { id: string; isTeamContact?: boolean }>({
            query: ({ id }) => ({
                url: `contact/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, { isTeamContact }) => {
                if (isTeamContact) {
                    return ["Contacts", "TeamSettings"];
                } else {
                    return ["Contacts", "UserSettings"];
                }
            },
        }),
        createUserContact: builder.mutation<Contact, Omit<Contact, "id">>({
            query: (contact) => ({
                url: `contact`,
                method: "PUT",
                body: JSON.stringify(contact),
            }),
            invalidatesTags: ["UserSettings"],
        }),
    }),
});

export const {
    useUpdateContactMutation,
    useGetAllContactsQuery,
    useTestContactMutation,
    useDeleteContactMutation,
    useCreateUserContactMutation,
} = ContactApi;
