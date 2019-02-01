// @flow
/* eslint-disable react/jsx-filename-extension, import/no-extraneous-dependencies */
import * as React from "react";
import { storiesOf } from "@storybook/react";
import ContactList from "../Components/ContactList/ContactList";
import { ContactTypes } from "../Domain/ContactType";
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
    .add("EmptyList", () => <ContactList {...commonProps} items={[]} />)
    .add("Single_Email", () => (
        <ContactList
            {...commonProps}
            items={[
                {
                    id: "1",
                    type: ContactTypes.mail,
                    user: "1",
                    value: "test@mail.ru",
                },
            ]}
        />
    ))
    .add("Single_Pushover", () => (
        <ContactList
            {...commonProps}
            items={[
                {
                    id: "1",
                    type: ContactTypes.pushover,
                    user: "1",
                    value: "u13XsadLKJjh273jafksaja7asjdkds ",
                },
            ]}
        />
    ))
    .add("TwoItems", () => (
        <ContactList
            {...commonProps}
            items={[
                {
                    id: "1",
                    type: ContactTypes.pushover,
                    user: "1",
                    value: "u13XsadLKJjh273jafksaja7asjdkds ",
                },
                {
                    id: "2",
                    type: ContactTypes.mail,
                    user: "1",
                    value: "test@mail.ru",
                },
            ]}
        />
    ))
    .add("AllTypesItems", () => (
        <ContactList
            {...commonProps}
            items={[
                {
                    id: "1",
                    type: ContactTypes.pushover,
                    user: "1",
                    value: "u13XsadLKJjh273jafksaja7asjdkds ",
                },
                {
                    id: "2",
                    type: ContactTypes.mail,
                    user: "1",
                    value: "test@mail.ru",
                },
                {
                    id: "3",
                    type: ContactTypes.slack,
                    user: "1",
                    value: "test@mail.ru",
                },
                {
                    id: "4",
                    type: ContactTypes["twilio voice"],
                    user: "1",
                    value: "test@mail.ru",
                },
                {
                    id: "5",
                    type: ContactTypes.telegram,
                    user: "1",
                    value: "test@mail.ru",
                },
            ]}
        />
    ));
