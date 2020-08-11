import { ContactConfig } from "./Config";

const ContactTypeCaptions = {
    mail: "EMail",
    email: "EMail",
    phone: "Phone",
    pushover: "Pushover",
    telegram: "Telegram",
    msteams: "Microsoft Teams",
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
