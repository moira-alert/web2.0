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
            providesTags: (result) =>
                result
                    ? [
                          ...result.map(({ id }) => ({ type: "Contact" as const, id })),
                          { type: "Contact", id: "LIST" },
                      ]
                    : [{ type: "Contact", id: "LIST" }],
        }),
        updateContact: builder.mutation<Contact, Partial<Contact> & Pick<Contact, "id">>({
            query: ({ id, ...contact }) => ({
                url: `contact/${id}`,
                method: "PUT",
                body: contact,
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: "Contact", id }, "Settings"],
        }),
        testContact: builder.mutation<void, string>({
            query: (id) => ({
                url: `contact/${id}/test`,
                method: "POST",
            }),
        }),
        deleteContact: builder.mutation<void, string>({
            query: (id) => ({
                url: `contact/${id}`,
                method: "DELETE",
            }),
            invalidatesTags: (_result, _error, id) => [{ type: "Contact", id }, "Settings"],
        }),
        createContact: builder.mutation<void, Contact>({
            query: (contact) => ({
                url: `contact`,
                method: "PUT",
                body: JSON.stringify(contact),
            }),
            invalidatesTags: ["Settings"],
        }),
    }),
});

export const {
    useUpdateContactMutation,
    useGetAllContactsQuery,
    useTestContactMutation,
    useDeleteContactMutation,
    useCreateContactMutation,
} = ContactApi;
