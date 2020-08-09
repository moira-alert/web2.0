import { Contact } from "../Domain/Contact";
import { Subscription } from "../Domain/Subscription";
import { Trigger } from "../Domain/Trigger";

export function omitContact({ ...contact }: Contact): Omit<Contact, "id"> {
    return contact;
}

export function omitSubscription({ ...subscription }: Subscription): Omit<Subscription, "id"> {
    return subscription;
}

export function omitTrigger({ ...trigger }: Trigger): Omit<Trigger, "id" | "last_check"> {
    return trigger;
}
