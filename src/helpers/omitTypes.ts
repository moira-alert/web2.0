/* eslint @typescript-eslint/no-unused-vars: 0 */
import { Contact } from "../Domain/Contact";
import { Subscription } from "../Domain/Subscription";
import { Trigger } from "../Domain/Trigger";

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
