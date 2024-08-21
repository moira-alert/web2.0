import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { validateForm } from "../helpers/validations";
import {
    useTestSubscriptionMutation,
    useUpdateSubscriptionMutation,
} from "../services/SubscriptionsApi";
import { Subscription } from "../Domain/Subscription";
import { useAppDispatch } from "../store/hooks";
import { BaseApi } from "../services/BaseApi";

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
    const dispatch = useAppDispatch();

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
                handleLoadingLocally: true,
                handleErrorLocally: true,
            }).unwrap();

            onCancel();
            dispatch(BaseApi.util.invalidateTags(teamId ? ["TeamSettings"] : ["UserSettings"]));
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
