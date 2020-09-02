import { Contact } from "./Contact";
import { Statuses } from "./Status";

export type Notification = {
    contact: Contact;
    event: {
        metric: string;
        old_state: Statuses;
        state: Statuses;
        sub_id: string;
        timestamp: number;
        trigger_id: string;
        value?: number;
    };
    send_fail: number;
    throttled: boolean;
    timestamp: number;
    trigger: {
        id: string;
        name: string;
        targets: Array<string>;
        __notifier_trigger_tags: Array<string>;
        desc: string;
        warn_value: number;
    };
};

export type NotificationList = {
    list: Array<Notification>;
    total: number;
};
