import * as React from "react";
import { CSFStory } from "creevey";
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

export default { title: "ContactTypeIcon" };

export const AllIconsInList: CSFStory<JSX.Element> = () => (
    <div>
        {iconTypes.map((type: string) => (
            <ContactTypeIcon key={type} type={type} />
        ))}
    </div>
);

AllIconsInList.story = {
    parameters: {
        creevey: {
            delay: 1000,
        },
    },
};
