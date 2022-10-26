import React from "react";
import ContactTypeIcon from "../Components/ContactTypeIcon/ContactTypeIcon";

export default {
    title: "ContactTypeIcon",
    component: ContactTypeIcon,
    creevey: {
        tests: {
            AllIcons: async () => {
                // Some icons get by url and loaded with a delay
                await new Promise((resolve) => setTimeout(resolve, 1000));

                // @ts-ignore matchImage is custom method
                await this.expect(await this.takeScreenshot()).to.matchImage();
            },
        },
    },
};

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

export const AllIconsInList = () => (
    <div>
        {iconTypes.map((type: string) => (
            <ContactTypeIcon key={type} type={type} />
        ))}
    </div>
);
