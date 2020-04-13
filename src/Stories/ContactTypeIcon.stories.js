// @flow
/* eslint-disable react/jsx-filename-extension, import/no-extraneous-dependencies */
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
            tests: {
                async AllIcons() {
                    // Some icons get by url and loaded with a delay
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await this.expect(await this.takeScreenshot()).to.matchImage();
                },
            },
        },
    })
    .add("AllIconsInList", () => (
        <div>
            {iconTypes.map(type => (
                <ContactTypeIcon type={type} />
            ))}
        </div>
    ));
