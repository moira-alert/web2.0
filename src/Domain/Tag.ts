import { Subscription } from "./Subscription";

export type TagStat = {
    data: {
        maintenance?: boolean | number;
    };
    name: string;
    subscriptions: Array<Subscription>;
    triggers: Array<string>;
};

export const MAX_LIST_LENGTH_BEFORE_SCROLLABLE = 40;
export const TAGS_LIST_HEIGHT = 1000;
export const TAGS_LIST_ROW_HEIGHT = 25;
export const SUBSCRIPTION_LIST_HEIGHT = 500;

export const getTotalSize = (items: TagStat[] | string[]) =>
    items.length * TAGS_LIST_ROW_HEIGHT + 1;

export const getItemSize = (subscription: Subscription) => {
    const { contacts } = subscription;
    if (contacts.length > 1) {
        return contacts.length * TAGS_LIST_ROW_HEIGHT;
    }

    return TAGS_LIST_ROW_HEIGHT;
};
