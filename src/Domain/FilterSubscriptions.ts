import { Subscription } from "./Subscription";

export const filterSubscriptions = (
    subscriptions: Subscription[],
    filterTags: string[]
): {
    filteredSubscriptions: Subscription[];
    availableTags: string[];
} => {
    const filteredSubscriptions = subscriptions.filter((subscription) =>
        filterTags.every((x) => subscription.tags.includes(x))
    );

    const availableTags = [...new Set(filteredSubscriptions.flatMap((i) => i.tags))];

    return {
        filteredSubscriptions,
        availableTags,
    };
};