import { useDeleteSubscriptionMutation } from "../services/SubscriptionsApi";
import { Subscription } from "../Domain/Subscription";

export const useDeleteSubscription = (
    subscription: Subscription,
    onCancel: () => void,
    setError: (error: string) => void,
    teamId?: string
) => {
    const [
        deleteSubscription,
        { isLoading: isDeletingSubscription },
    ] = useDeleteSubscriptionMutation();

    const handleDeleteSubscription = async (): Promise<void> => {
        try {
            await deleteSubscription({
                id: subscription.id,
                handleLoadingLocally: true,
                handleErrorLocally: true,
                tagsToInvalidate: [teamId ? "TeamSettings" : "UserSettings", "TagStats"],
            }).unwrap();
            onCancel();
        } catch (error) {
            setError(error);
        }
    };

    return {
        handleDeleteSubscription,
        isDeletingSubscription,
    };
};
