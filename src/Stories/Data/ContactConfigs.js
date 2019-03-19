// @flow
/* eslint-disable react/jsx-filename-extension, import/no-extraneous-dependencies */
import type { ContactConfig } from "../../Domain/Config";

const contactConfigs: Array<ContactConfig> = [
    {
        type: "email",
        label: "E-mail",
    },
    {
        type: "slack",
        label: "Slack",
        validation: "^[@#][a-zA-Z0-9-_]+",
        placeholder: "Slack #channel or @user",
    },
    {
        type: "phone",
        label: "Phone",
        validation: "^9\\d{9}$",
        placeholder: "In format 98743210",
        help: "Phone for Kontur SMS",
    },
];

export { contactConfigs as default };
