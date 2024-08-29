import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { validateForm } from "../helpers/validations";
import {
    useCreateUserSubscriptionMutation,
    useTestSubscriptionMutation,
} from "../services/SubscriptionsApi";
import { useCreateTeamSubscriptionMutation } from "../services/TeamsApi";
import type { SubscriptionCreateInfo } from "../Api/MoiraApi";
import { useAppDispatch } from "../store/hooks";
import { BaseApi } from "../services/BaseApi";

export const useCreateSubscription = (
    validationContainer: React.RefObject<ValidationContainer>,
    subscription: SubscriptionCreateInfo | null,
    onCancel: () => void,
    setError: (error: string) => void,
    teamId?: string
) => {
    const [
        createUserSubscription,
        { isLoading: isCreatingUserSubscription },
    ] = useCreateUserSubscriptionMutation();
    const [
        createTeamSubscription,
        { isLoading: isCreatingTeamSubscription },
    ] = useCreateTeamSubscriptionMutation();
    const [testSubscription, { isLoading: isTestingSubscription }] = useTestSubscriptionMutation();
    const dispatch = useAppDispatch();

    const handleCreateSubscription = async (testAfterCreation?: boolean) => {
        const validationSuccess = await validateForm(validationContainer);
        if (!validationSuccess || !subscription) {
            return;
        }

        try {
            const createdSubscription = teamId
                ? await createTeamSubscription({
                      ...subscription,
                      teamId,
                      handleErrorLocally: true,
                      handleLoadingLocally: true,
                  }).unwrap()
                : await createUserSubscription({
                      ...subscription,
                      handleErrorLocally: true,
                      handleLoadingLocally: true,
                  }).unwrap();
            if (testAfterCreation) {
                await testSubscription({
                    id: createdSubscription.id,
                    handleErrorLocally: true,
                    handleLoadingLocally: true,
                }).unwrap();
            }

            dispatch(BaseApi.util.invalidateTags(teamId ? ["TeamSettings"] : ["UserSettings"]));

            onCancel();
        } catch (error) {
            setError(error);
        }
    };

    return {
        handleCreateSubscription,
        isCreatingUserSubscription,
        isCreatingTeamSubscription,
        isTestingSubscription,
    };
};
