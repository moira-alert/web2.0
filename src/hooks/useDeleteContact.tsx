import { Contact } from "../Domain/Contact";
import { useDeleteContactMutation } from "../services/ContactApi";

export const useDeleteContact = (
    contact: Contact | null,
    onCancel: () => void,
    setError: (error: string) => void,
    teamId?: string
) => {
    const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();

    const handleDeleteContact = async (): Promise<void> => {
        if (!contact) {
            return;
        }
        try {
            await deleteContact({
                id: contact.id,
                handleLoadingLocally: true,
                handleErrorLocally: true,
                tagsToInvalidate: [teamId ? "TeamSettings" : "UserSettings", "Contacts"],
            }).unwrap();
            onCancel();
        } catch (error) {
            setError(error);
        }
    };

    return { handleDeleteContact, isDeleting };
};
