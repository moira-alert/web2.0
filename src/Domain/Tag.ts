import { Subscription } from "./Subscription";

export type TagStat = {
    data: {
        maintenance?: boolean | number;
    };
    name: string;
    subscriptions: Array<Subscription>;
    triggers: Array<string>;
};

export type TagList = {
    list: Array<string>;
};

export type TagStatList = {
    list: Array<TagStat>;
};
