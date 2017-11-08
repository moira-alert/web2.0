// @flow
export const ContactTypes = {
    email: "mail",
    pushover: "pushover",
    telegram: "telegram",
    slack: "slack",
    ["twilio voice"]: "twilio voice",
};

export const ContactTypeCaptions = [
    ["email", "EMail"],
    ["pushover", "Pushover"],
    ["telegram", "Telegram"],
    ["twilio voice", "Twilio voice"],
    ["slack", "slack"],
];

export type ContactType = $Keys<typeof ContactTypes>;
