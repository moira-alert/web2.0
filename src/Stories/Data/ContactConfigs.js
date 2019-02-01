// @flow
/* eslint-disable react/jsx-filename-extension, import/no-extraneous-dependencies */
import { ContactTypes } from "../../Domain/ContactType";
import type { ContactConfig } from "../../Domain/Config";

const contactConfigs: Array<ContactConfig> = [
    {
        type: ContactTypes.email,
        validation: "^.+@.+..+$",
    },
    {
        type: ContactTypes.phone,
        validation: "^9d{9}$",
        title: "kontur sms",
        help: "Phone number format 9*********",
    },
    {
        type: ContactTypes.pushover,
        validation: "",
        title: "Pushover user key",
    },
    {
        type: ContactTypes.slack,
        validation: "^[@#][a-zA-Z0-9-_]+",
        title: "slack #channel / @user",
    },
    {
        type: ContactTypes.telegram,
        validation: "",
        title: "#channel, @username, group",
        help:
            "Required to grant [@KonturMoiraBot](https://t.me/KonturMoiraBot) admin privileges for channels,\nor `/start` command in groups and personal chats",
    },
    {
        type: ContactTypes["twilio voice"],
        validation: "^+79d{9}$",
        title: "twilio voice",
        help: "Phone number format +79*********",
    },
];

export { contactConfigs as default };
