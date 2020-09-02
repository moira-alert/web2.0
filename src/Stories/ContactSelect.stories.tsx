import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import ContactSelect from "../Components/ContactSelect/ContactSelect";

storiesOf("ContactSelect", module)
    .add("Empty", () => (
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
    ))
    .add("Default", () => (
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
    ));
