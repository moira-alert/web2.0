import { Subscription } from "./Subscription";

export const filterSubscriptions = (
    subscriptions: Subscription[],
    filterTags: string[],
    contactIDs: string[]
): {
    filteredSubscriptions: Subscription[];
    availableTags: string[];
    availableContactIDs: string[];
} => {
    const filteredSubscriptions = subscriptions.filter((subscription) => {
        return (
            filterTags.every((tag) => subscription.tags.includes(tag)) &&
            contactIDs.every((id) => subscription.contacts.includes(id))
        );
    });

    const availableTags = [
        ...new Set(filteredSubscriptions.flatMap((subscription) => subscription.tags)),
    ];
    const availableContactIDs = [
        ...new Set(filteredSubscriptions.flatMap((subscription) => subscription.contacts)),
    ];

    return {
        filteredSubscriptions,
        availableTags,
        availableContactIDs,
    };
};
