import { useState } from "react";
import { filterSubscriptions } from "../Domain/FilterSubscriptions";
import { Subscription } from "../Domain/Subscription";

export function useFilterSubscriptions(subscriptions: Subscription[]) {
    const [filterContactIDs, setFilterContactIDs] = useState<string[]>([]);
    const [filterTags, setFilterTags] = useState<string[]>([]);

    const { filteredSubscriptions, availableTags, availableContactIDs } = filterSubscriptions(
        subscriptions,
        filterTags,
        filterContactIDs
    );

    const handleSetFilterTags = (tags: string[]) => {
        setFilterTags(tags);
    };

    const handleSetFilterContactIDs = (contactID: string) => {
        const contactIndex = filterContactIDs.indexOf(contactID);
        if (contactIndex === -1) {
            setFilterContactIDs((prev) => [...prev, contactID]);
        } else {
            setFilterContactIDs((prev) =>
                prev.filter((id) => {
                    return id !== contactID;
                })
            );
        }
    };

    return {
        filteredSubscriptions,
        availableTags,
        availableContactIDs,
        filterContactIDs,
        filterTags,
        handleSetFilterTags,
        handleSetFilterContactIDs,
    };
}
