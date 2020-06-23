// @flow
import type { Contact } from "../Domain/Contact";
import type { Subscription } from "../Domain/Subscription";
import type { Trigger } from "../Domain/Trigger";

export function omitContact({ id, ...contact }: Contact): Omit<Contact, "id"> {
    return contact;
}

export function omitSubscription({ id, ...subscription }: Subscription): Omit<Subscription, "id"> {
    return subscription;
}

export function omitTrigger({
    id,
    last_check,
    ...trigger
}: Trigger): Omit<Trigger, "id" | "last_check"> {
    return trigger;
}
