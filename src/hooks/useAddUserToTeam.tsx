import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { useAddUserToTeamMutation } from "../services/TeamsApi";
import { validateForm } from "../helpers/validations";

export const useAddUserToTeam = (
    validationContainer: React.RefObject<ValidationContainer>,
    userName: string,
    onCancel: () => void,
    setError: (error: string) => void,
    teamId: string
) => {
    const [addUserToTeam, { isLoading: isAddingUser }] = useAddUserToTeamMutation();
    const handleAddUserToTeam = async () => {
        const validationSuccess = await validateForm(validationContainer);
        if (!validationSuccess) {
            return;
        }
        try {
            await addUserToTeam({
                teamId,
                userName,
                handleErrorLocally: true,
                handleLoadingLocally: true,
            }).unwrap();
            onCancel();
        } catch (error) {
            setError(error);
        }
    };
    return { handleAddUserToTeam, isAddingUser };
};
