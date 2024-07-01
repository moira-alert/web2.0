import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Contact } from "../Domain/Contact";
import { useTestContactMutation, useUpdateContactMutation } from "../services/ContactApi";
import { validateForm } from "../Components/TriggerEditForm/Validations/validations";

export const useUpdateContact = (
    validationContainer: React.RefObject<ValidationContainer>,
    contact: Contact | null,
    onCancel: () => void,
    setError: (error: string) => void,
    teamId?: string
) => {
    const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation();
    const [testContact, { isLoading: isTesting }] = useTestContactMutation();

    const handleUpdateContact = async (testAfterUpdate?: boolean) => {
        if (!(await validateForm(validationContainer)) || !contact) {
            return;
        }

        try {
            if (testAfterUpdate) {
                await testContact({
                    id: contact.id,
                    handleLoadingLocally: true,
                    handleErrorLocally: true,
                }).unwrap();
            }
            await updateContact({
                ...contact,
                isTeamContact: !!teamId,
                handleLoadingLocally: true,
                handleErrorLocally: true,
            }).unwrap();

            onCancel();
        } catch (error) {
            setError(error);
        }
    };

    return { handleUpdateContact, isUpdating, isTesting };
};
