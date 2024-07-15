import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { useUpdateTeamMutation } from "../services/TeamsApi";
import { Team } from "../Domain/Team";
import { validateForm } from "../helpers/validations";

export const useUpdateTeam = (
    validationRef: React.RefObject<ValidationContainer>,
    team: Team | undefined,
    name: string,
    description: string,
    setError: (error: string) => void,
    onClose: () => void
) => {
    const [updateTeam, { isLoading: isUpdatingTeam }] = useUpdateTeamMutation();

    const handleUpdateTeam = async () => {
        const validationSuccess = await validateForm(validationRef);
        if (!validationSuccess || !team) {
            return;
        }

        try {
            await updateTeam({
                ...team,
                name,
                description,
                handleErrorLocally: true,
                handleLoadingLocally: true,
            }).unwrap();
            onClose();
        } catch (error) {
            setError(error);
        }
    };

    return { handleUpdateTeam, isUpdatingTeam };
};
