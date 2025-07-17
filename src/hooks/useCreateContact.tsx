import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Contact } from "../Domain/Contact";
import { useCreateUserContactMutation, useTestContactMutation } from "../services/ContactApi";
import { validateForm } from "../helpers/validations";
import { useCreateTeamContactMutation } from "../services/TeamsApi";
import { useAppDispatch } from "../store/hooks";
import { BaseApi } from "../services/BaseApi";

export const useCreateContact = (
    validationContainer: React.RefObject<ValidationContainer>,
    contactInfo: Partial<Contact> | null,
    onCancel: () => void,
    setError: (error: string) => void,
    teamId?: string
) => {
    const [
        createUserContact,
        { isLoading: isUserContactCreating },
    ] = useCreateUserContactMutation();
    const [
        createTeamContact,
        { isLoading: isTeamContactCreating },
    ] = useCreateTeamContactMutation();
    const [testContact, { isLoading: isTesting }] = useTestContactMutation();
    const dispatch = useAppDispatch();

    const handleCreateContact = async (testAfterCreation?: boolean): Promise<void> => {
        if (
            !(await validateForm(validationContainer)) ||
            !contactInfo ||
            !contactInfo.value ||
            !contactInfo.type
        ) {
            return;
        }

        const { name, type, value, extra_message } = contactInfo;

        const requestContact = {
            value,
            type,
            name,
            extra_message,
        };

        try {
            const createdContact = teamId
                ? await createTeamContact({
                      team_id: teamId,
                      handleLoadingLocally: true,
                      handleErrorLocally: true,
                      ...requestContact,
                  }).unwrap()
                : await createUserContact({
                      handleLoadingLocally: true,
                      handleErrorLocally: true,
                      ...requestContact,
                  }).unwrap();

            if (testAfterCreation) {
                await testContact({
                    id: createdContact.id,
                    handleLoadingLocally: true,
                    handleErrorLocally: true,
                }).unwrap();
            }
            dispatch(BaseApi.util.invalidateTags(teamId ? ["TeamSettings"] : ["UserSettings"]));

            onCancel();
        } catch (error) {
            setError(error);
        }
    };

    const isCreating = isTeamContactCreating || isUserContactCreating;

    return { handleCreateContact, isCreating, isTesting };
};
