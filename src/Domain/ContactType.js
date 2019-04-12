// @flow
import type { ContactConfig } from "./Config";

export const ContactTypes = {
    mail: "mail",
    email: "email",
    phone: "phone",
    pushover: "pushover",
    telegram: "telegram",
    slack: "slack",
    "twilio sms": "twilio sms",
    "twilio voice": "twilio voice",
};

const ContactTypeCaptions = {
    mail: "EMail",
    email: "EMail",
    phone: "Phone",
    pushover: "Pushover",
    telegram: "Telegram",
    "twilio sms": "Twilio SMS",
    "twilio voice": "Twilio voice",
    slack: "slack",
};

export function getContactTypeCaption(contactConfig: ContactConfig): string {
    if (ContactTypeCaptions[contactConfig.type] !== null) {
        return ContactTypeCaptions[contactConfig.type];
    }
    return contactConfig.type;
}
