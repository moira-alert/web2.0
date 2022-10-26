import React from "react";
import ContactList from "../Components/ContactList/ContactList";
import actionWithDelay from "./StoryUtils";
import contactConfigs from "./Data/ContactConfigs";

export default {
    title: "ContactList",
    component: ContactList,
};

const commonProps = {
    contactDescriptions: contactConfigs,
    onTestContact: actionWithDelay("onTestContact", 2000),
    onRemoveContact: actionWithDelay("onRemoveContact", 2000),
    onUpdateContact: actionWithDelay("onUpdateContact", 2000),
    onAddContact: actionWithDelay("onAddContact", 2000),
};

export const Empty = () => <ContactList {...commonProps} items={[]} />;

export const OneItem = () => (
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
);

export const FewItems = () => (
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
);

export const InvalidItems = () => (
    <ContactList
        {...commonProps}
        items={[
            {
                id: "1",
                type: "icq",
                user: "1",
                value: "223344",
            },
        ]}
    />
);
