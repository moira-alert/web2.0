// @flow
export const ContactTypes = {
    email: "email",
    pushover: "pushover",
    telegram: "telegram",
    phone: "phone",
    slack: "slack",
    ["twilio voice"]: "twilio voice",
};

export const ContactTypeCaptions = [
    ["email", "EMail"],
    ["pushover", "Pushover"],
    ["telegram", "Telegram"],
    ["phone", "Kontur SMS"],
    ["twilio voice", "Twilio voice"],
    ["slack", "slack"],
];

export type ContactType = $Keys<typeof ContactTypes>;
