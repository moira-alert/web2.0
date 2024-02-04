import * as React from "react";
import ContactTypeIcon from "../Components/ContactTypeIcon/ContactTypeIcon";

const iconTypes = [
    "slack",
    "msteams",
    "telegram",
    "facebook",
    "viber",
    "whatsapp",
    "twitter",
    "mail",
    "pushover",
    "twilio",
    "webhook",
    "sms",
    "phone",
    "tel",
];

export default {
    title: "ContactTypeIcon",
};

export const AllIconsInList = () => (
    <div>
        {iconTypes.map((type: string) => (
            <ContactTypeIcon key={type} type={type} />
        ))}
    </div>
);
