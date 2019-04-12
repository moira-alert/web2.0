// @flow
/* eslint-disable react/jsx-filename-extension, import/no-extraneous-dependencies */
import * as React from "react";
import { storiesOf } from "@storybook/react";
import ContactTypeIcon from "../Components/ContactTypeIcon/ContactTypeIcon";

const iconTypes = [
    "slack",
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

storiesOf("ContactTypeIcon", module).add("AllIconsInList", () => (
    <div>
        {iconTypes.map(type => (
            <ContactTypeIcon type={type} />
        ))}
    </div>
));
