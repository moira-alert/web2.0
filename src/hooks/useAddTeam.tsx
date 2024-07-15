import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { useAddTeamMutation } from "../services/TeamsApi";
import { validateForm } from "../helpers/validations";

export const useAddTeam = (
    validationRef: React.RefObject<ValidationContainer>,
    name: string,
    description: string,
    setError: (error: string) => void,
    onClose: () => void
) => {
    const [addTeam, { isLoading: isAddingTeam }] = useAddTeamMutation();

    const handleAddTeam = async () => {
        const validationSuccess = await validateForm(validationRef);
        if (!validationSuccess) {
            return;
        }

        try {
            await addTeam({
                name: name,
                description: description,
                handleErrorLocally: true,
                handleLoadingLocally: true,
            }).unwrap();
            onClose();
        } catch (error) {
            setError(error);
        }
    };

    return { handleAddTeam, isAddingTeam };
};
