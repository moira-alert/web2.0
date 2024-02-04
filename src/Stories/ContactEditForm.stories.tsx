import * as React from "react";
import { action } from "@storybook/addon-actions";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import ContactEditForm from "../Components/ContactEditForm/ContactEditForm";
import contactConfigs from "./Data/ContactConfigs";
import { Meta } from "@storybook/react";

const commonProps = {
    onChange: action("onChange"),
    contactDescriptions: contactConfigs,
};

const meta: Meta = {
    title: "ContactEditForm",
    component: ContactEditForm,
    decorators: [(story) => <ValidationContainer>{story()}</ValidationContainer>],
};

export const Empty = {
    render: () => <ContactEditForm {...commonProps} contactInfo={null} />,
};

export const Filled = {
    render: () => (
        <ContactEditForm
            {...commonProps}
            contactInfo={{
                type: "email",
                value: "test@email",
            }}
        />
    ),
};

export default meta;
