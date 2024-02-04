import * as React from "react";
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

export default {
    title: "ContactList",
    component: ContactList,
};

export const Empty = {
    render: () => <ContactList {...commonProps} items={[]} />,
};

export const OneItem = {
    render: () => (
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
    ),
};

export const FewItems = {
    render: () => (
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
    ),
};

export const InvalidItem = {
    render: () => (
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
    ),
};
