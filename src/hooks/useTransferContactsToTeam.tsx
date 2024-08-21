import { useUpdateContactMutation } from "../services/ContactApi";
import { Contact } from "../Domain/Contact";
import { useCallback } from "react";

export const useTransferContactsToTeam = () => {
    const [updateContact] = useUpdateContactMutation();

    const transferContactsToTeam = useCallback(async (contacts: Contact[], teamId: string): Promise<
        void
    > => {
        await Promise.all(
            contacts.map(async (contact) => {
                const { user, ...contactWithoutUser } = contact;
                const updatedContact = {
                    ...contactWithoutUser,
                    team_id: teamId,
                };
                await updateContact(updatedContact);
            })
        );
    }, []);

    return { transferContactsToTeam };
};
