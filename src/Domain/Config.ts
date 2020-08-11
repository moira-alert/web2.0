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

export interface ContactConfig {
    type: ContactTypes;
    label: string;
    validation?: string;
    placeholder?: string;
    help?: string;
}

export interface Config {
    supportEmail: string;
    contacts: Array<ContactConfig>;
    remoteAllowed?: boolean;
}
