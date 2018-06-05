// @flow
import type { ContactConfig } from "../../Domain/Config";

export const contactConfigs: Array<ContactConfig> = [
    {
        type: "email",
        validation: "^.+@.+..+$",
    },
    {
        type: "phone",
        validation: "^9d{9}$",
        title: "kontur sms",
        help: "Phone number format 9*********",
    },
    {
        type: "pushover",
        validation: "",
        title: "Pushover user key",
    },
    {
        type: "slack",
        validation: "^[@#][a-zA-Z0-9-_]+",
        title: "slack #channel / @user",
    },
    {
        type: "telegram",
        validation: "",
        title: "#channel, @username, group",
        help:
            "Required to grant [@KonturMoiraBot](https://t.me/KonturMoiraBot) admin privileges for channels,\nor `/start` command in groups and personal chats",
    },
    {
        type: "twilio voice",
        validation: "^+79d{9}$",
        title: "twilio voice",
        help: "Phone number format +79*********",
    },
];
