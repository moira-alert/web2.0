import { Subscription } from "../Domain/Subscription";

export function notUndefined<T>(x?: T): x is T {
    return x !== undefined;
}

export const clearInput = (input: string | Array<string>): string => {
    let cleared = Array.isArray(input) ? input.join(" ") : input;

    cleared = cleared.trim();
    cleared = cleared.replace(/[\s]+/g, " ");

    return cleared;
};

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
