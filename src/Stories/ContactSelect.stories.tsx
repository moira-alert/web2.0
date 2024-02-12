import * as React from "react";
import { action } from "@storybook/addon-actions";
import ContactSelect from "../Components/ContactSelect/ContactSelect";

export default {
    title: "ContactSelect",
};

export const Empty = () => (
    <ContactSelect
        contactIds={[]}
        onChange={action("onChange")}
        availableContacts={[
            {
                id: "1",
                type: "phone",
                user: "1",
                value: "9876543210",
            },
            {
                id: "2",
                type: "email",
                user: "1",
                value: "test@mail.ru",
            },
        ]}
    />
);

export const Default = () => (
    <ContactSelect
        contactIds={["1"]}
        onChange={action("onChange")}
        availableContacts={[
            {
                id: "1",
                type: "phone",
                user: "1",
                value: "9876543210",
            },
            {
                id: "2",
                type: "email",
                user: "1",
                value: "test@mail.ru",
            },
        ]}
    />
);
