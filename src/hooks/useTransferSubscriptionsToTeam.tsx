import { useUpdateSubscriptionMutation } from "../services/SubscriptionsApi";
import { Subscription } from "../Domain/Subscription";
import { useCallback } from "react";

export const useTransferSubscriptionsToTeam = () => {
    const [updateSubscription] = useUpdateSubscriptionMutation();

    const transferSubscriptionsToTeam = useCallback(
        async (subscriptions: Subscription[], teamId: string): Promise<void> => {
            await Promise.all(
                subscriptions.map(async (subscription) => {
                    const updatedSubscription = {
                        ...subscription,
                        user: "",
                        team_id: teamId,
                    };
                    await updateSubscription(updatedSubscription);
                })
            );
        },
        []
    );

    return { transferSubscriptionsToTeam };
};
