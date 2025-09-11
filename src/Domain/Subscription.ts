import { DtoSubscription } from "./__generated__/data-contracts";

export type Subscription = DtoSubscription;

export type SubscriptionCreateInfo = Omit<Subscription, "id" | "user" | "team_id"> & {
    id?: string;
    user?: string;
};
