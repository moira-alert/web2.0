import React from "react";
import { action } from "@storybook/addon-actions";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import ContactEditForm from "../Components/ContactEditForm/ContactEditForm";
import contactConfigs from "./Data/ContactConfigs";

export default {
    title: "ContactEditForm",
    component: ContactEditForm,
    decorators: [
        (story: () => JSX.Element) => <ValidationContainer>{story()}</ValidationContainer>,
    ],
};

const commonProps = {
    onChange: action("onChange"),
    contactDescriptions: contactConfigs,
};

export const Empty = () => <ContactEditForm {...commonProps} contactInfo={null} />;

export const Filled = () => (
    <ContactEditForm
        {...commonProps}
        contactInfo={{
            type: "email",
            value: "test@email",
        }}
    />
);
