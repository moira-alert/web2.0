import { Schedule } from "./Schedule";

export type Subscription = {
    sched: Schedule;
    tags: Array<string>;
    any_tags?: boolean;
    throttling: boolean;
    contacts: Array<string>;
    enabled: boolean;
    user: string;
    id: string;
    team_id?: string;
    ignore_recoverings: boolean;
    ignore_warnings: boolean;
    plotting?: {
        enabled: boolean;
        theme: "light" | "dark";
    };
};

export type SubscriptionCreateInfo = Omit<Subscription, "id" | "user" | "any_tags"> & {
    id?: string;
    user?: string;
    any_tags: boolean;
};
