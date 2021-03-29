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
    user: string;
    value: string;
    team_id?: string;
}

export interface ContactList {
    list: Array<Contact>;
}
