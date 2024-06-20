import { Subscription } from "./Subscription";

export enum ContactTypes {
    mail = "mail",
    email = "email",
    phone = "phone",
    pushover = "pushover",
    telegram = "telegram",
    msteams = "msteams",
    slack = "slack",
    "twilio sms" = "twilio sms",
    "twilio voice" = "twilio voice",
}

export interface Contact {
    id: string;
    type: string;
    user?: string;
    value: string;
    team?: string;
    name?: string;
}

export interface ContactList {
    list: Array<Contact>;
}

export const filterSubscriptionContacts = (contacts: Contact[], subscription: Subscription) =>
    contacts.filter((contact) =>
        subscription.contacts.some((subscriptionContactId) => contact.id === subscriptionContactId)
    );

export const normalizeContactValueForApi = (contactType: string, value: string): string => {
    let result = value.trim();
    if (contactType === "twilio voice" || contactType === "twilio sms") {
        if (result.length >= 11) {
            result = result.replace(/^8/, "+7");
            result = result.replace(/^7/, "+7");
        } else if (result.length === 10) {
            result = `+7${result}`;
        }
        return result;
    }
    return result;
};
