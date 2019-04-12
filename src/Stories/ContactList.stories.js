// @flow
/* eslint-disable react/jsx-filename-extension, import/no-extraneous-dependencies */
import * as React from "react";
import { storiesOf } from "@storybook/react";
import ContactList from "../Components/ContactList/ContactList";
import actionWithDelay from "./StoryUtils";
import contactConfigs from "./Data/ContactConfigs";

const commonProps = {
    contactDescriptions: contactConfigs,
    onTestContact: actionWithDelay("onTestContact", 2000),
    onRemoveContact: actionWithDelay("onRemoveContact", 2000),
    onUpdateContact: actionWithDelay("onUpdateContact", 2000),
    onAddContact: actionWithDelay("onAddContact", 2000),
};

storiesOf("ContactList", module)
    .add("empty", () => <ContactList {...commonProps} items={[]} />)
    .add("one item", () => (
        <ContactList
            {...commonProps}
            items={[
                {
                    id: "1",
                    type: "email",
                    user: "1",
                    value: "test@mail.ru",
                },
            ]}
        />
    ))
    .add("few items", () => (
        <ContactList
            {...commonProps}
            items={[
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
