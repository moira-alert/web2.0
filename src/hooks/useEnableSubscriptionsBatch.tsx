import { useUpdateSubscriptionMutation } from "../services/SubscriptionsApi";
import { useCallback } from "react";
import { Subscription } from "../Domain/Subscription";

export const useEnableSubscriptionsBatch = () => {
    const [updateSubscription] = useUpdateSubscriptionMutation();

    const enableSubscriptions = useCallback(async (subscriptions: Subscription[]): Promise<
        void
    > => {
        await Promise.all(
            subscriptions.map(async (subscription) => {
                const updatedSubscription = {
                    ...subscription,
                    enabled: !subscription.enabled,
                };
                await updateSubscription(updatedSubscription);
            })
        );
    }, []);

    return { enableSubscriptions };
};
