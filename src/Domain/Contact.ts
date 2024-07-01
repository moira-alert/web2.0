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

export interface TeamContactCreateInfo {
    value: string;
    type: string;
    name?: string;
    teamId: string;
}

export interface ContactList {
    list: Array<Contact>;
}

export const filterSubscriptionContacts = (contacts: Contact[], subscription: Subscription) =>
    contacts.filter((contact) =>
        subscription.contacts.some((subscriptionContactId) => contact.id === subscriptionContactId)
    );
