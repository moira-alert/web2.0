import { Contact, ContactList } from "../Domain/Contact";
import { BaseApi } from "./BaseApi";
import type { CustomBaseQueryArgs } from "./BaseApi";

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
            CustomBaseQueryArgs<
                Partial<Contact> & Pick<Contact, "id"> & { isTeamContact?: boolean }
            >
        >({
            query: ({
                id,
                handleErrorLocally,
                handleLoadingLocally,
                isTeamContact,
                ...contact
            }) => ({
                url: `contact/${id}`,
                method: "PUT",
                credentials: "same-origin",
                body: JSON.stringify(contact),
            }),
            invalidatesTags: (_result, error, { isTeamContact }) => {
                if (error) {
                    return [];
                }
                return ["Contacts", isTeamContact ? "TeamSettings" : "UserSettings"];
            },
        }),
        testContact: builder.mutation<void, CustomBaseQueryArgs<{ id: string }>>({
            query: ({ id }) => ({
                url: `contact/${id}/test`,
                credentials: "same-origin",
                method: "POST",
            }),
        }),
        deleteContact: builder.mutation<
            void,
            CustomBaseQueryArgs<{ id: string; isTeamContact?: boolean }>
        >({
            query: ({ id }) => ({
                url: `contact/${id}`,
                method: "DELETE",
                credentials: "same-origin",
            }),
            invalidatesTags: (_result, error, { isTeamContact }) => {
                if (error) {
                    return [];
                }
                return ["Contacts", isTeamContact ? "TeamSettings" : "UserSettings"];
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
    }),
});

export const {
    useUpdateContactMutation,
    useGetAllContactsQuery,
    useTestContactMutation,
    useDeleteContactMutation,
    useCreateUserContactMutation,
} = ContactApi;
