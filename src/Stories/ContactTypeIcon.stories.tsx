import * as React from "react";
import { storiesOf } from "@storybook/react";
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

storiesOf("ContactTypeIcon", module)
    .addParameters({
        creevey: {
            skip: {
                flacky: { stories: "AllIconsInList" },
            },
        },
    })
    .add("AllIconsInList", () => (
        <div>
            {iconTypes.map((type: string) => (
                <ContactTypeIcon key={type} type={type} />
            ))}
        </div>
    ));
