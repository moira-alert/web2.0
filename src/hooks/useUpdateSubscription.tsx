import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { validateForm } from "../helpers/validations";
import {
    useTestSubscriptionMutation,
    useUpdateSubscriptionMutation,
} from "../services/SubscriptionsApi";
import { Subscription } from "../Domain/Subscription";

export const useUpdateSubscription = (
    validationContainer: React.RefObject<ValidationContainer>,
    subscription: Subscription,
    onCancel: () => void,
    setError: (error: string) => void,
    teamId?: string
) => {
    const [
        updateSubscription,
        { isLoading: isUpdatingSubscription },
    ] = useUpdateSubscriptionMutation();
    const [testSubscription, { isLoading: isTestingSubscription }] = useTestSubscriptionMutation();

    const handleUpdateSubscription = async (testAfterUpdate?: boolean): Promise<void> => {
        if (!(await validateForm(validationContainer))) {
            return;
        }
        try {
            if (testAfterUpdate) {
                await testSubscription({
                    id: subscription.id,
                    handleLoadingLocally: true,
                    handleErrorLocally: true,
                }).unwrap();
            }
            await updateSubscription({
                ...subscription,
                isTeamSubscription: !!teamId,
                handleLoadingLocally: true,
                handleErrorLocally: true,
            }).unwrap();

            onCancel();
        } catch (error) {
            setError(error);
        }
    };

    return {
        handleUpdateSubscription,
        isUpdatingSubscription,
        isTestingSubscription,
    };
};
