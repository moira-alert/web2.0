import { Contact } from "../Domain/Contact";
import { Subscription } from "../Domain/Subscription";
import { Trigger } from "../Domain/Trigger";

export function omitContact({ id: _id, ...contact }: Contact): Omit<Contact, "id"> {
    return contact;
}

export function omitSubscription({
    id: _id,
    ...subscription
}: Subscription): Omit<Subscription, "id"> {
    return subscription;
}

export function omitTrigger({
    id: _id,
    last_check: _lastCheck,
    ...trigger
}: Trigger): Omit<Trigger, "id" | "last_check"> {
    return trigger;
}
