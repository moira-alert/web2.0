import { ContactConfig, ContactTypes } from "../../Domain/Config";

const contactConfigs: Array<ContactConfig> = [
    {
        type: ContactTypes.email,
        label: "E-mail",
    },
    {
        type: ContactTypes.slack,
        label: "Slack",
        validation: "^[@#][a-zA-Z0-9-_]+",
        placeholder: "Slack #channel or @user",
    },
    {
        type: ContactTypes.phone,
        label: "Phone",
        validation: "^9\\d{9}$",
        placeholder: "In format 98743210",
        help: "Phone for Kontur SMS",
    },
];

export default contactConfigs;
