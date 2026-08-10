import {
    MAX_TAG_LIST_LENGTH_BEFORE_SCROLLABLE,
    SUBSCRIPTION_LIST_HEIGHT,
    TAG_ROW_HEIGHT,
} from "../../Constants/heights";
import { TagStat } from "../../Domain/Tag";

export const getSubscriptionsPanelHeight = (subscriptions: TagStat["subscriptions"]) => {
    const subscriptionContactsCount = subscriptions.flatMap(
        (subscription) => subscription.contacts
    ).length;

    return subscriptionContactsCount > MAX_TAG_LIST_LENGTH_BEFORE_SCROLLABLE
        ? SUBSCRIPTION_LIST_HEIGHT
        : getTotalItemSize(subscriptionContactsCount);
};

export const getTotalItemSize = (length: number) => length * TAG_ROW_HEIGHT + 1;
