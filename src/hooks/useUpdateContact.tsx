import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Contact } from "../Domain/Contact";
import { useTestContactMutation, useUpdateContactMutation } from "../services/ContactApi";
import { validateForm } from "../helpers/validations";
import { useAppDispatch } from "../store/hooks";
import { BaseApi } from "../services/BaseApi";

export const useUpdateContact = (
    validationContainer: React.RefObject<ValidationContainer>,
    contact: Contact | null,
    onCancel: () => void,
    setError: (error: string) => void,
    teamId?: string
) => {
    const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation();
    const [testContact, { isLoading: isTesting }] = useTestContactMutation();
    const dispatch = useAppDispatch();

    const handleUpdateContact = async (testAfterUpdate?: boolean) => {
        const validationSuccess = await validateForm(validationContainer);
        if (!validationSuccess || !contact) {
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
                handleLoadingLocally: true,
                handleErrorLocally: true,
            }).unwrap();

            onCancel();
            dispatch(BaseApi.util.invalidateTags(teamId ? ["TeamSettings"] : ["UserSettings"]));
        } catch (error) {
            setError(error);
        }
    };

    return { handleUpdateContact, isUpdating, isTesting };
};
