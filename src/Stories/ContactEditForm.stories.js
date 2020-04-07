// @flow
/* eslint-disable react/jsx-filename-extension, import/no-extraneous-dependencies */
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import ContactEditForm from "../Components/ContactEditForm/ContactEditForm";
import contactConfigs from "./Data/ContactConfigs";

const commonProps = {
    onChange: action("onChange"),
    contactDescriptions: contactConfigs,
};

storiesOf("ContactEditForm", module)
    .addDecorator(story => <ValidationContainer>{story()}</ValidationContainer>)
    .add("empty", () => <ContactEditForm {...commonProps} contactInfo={null} />)
    .add("filled", () => (
        <ContactEditForm
            {...commonProps}
            contactInfo={{
                type: "email",
                value: "test@email",
            }}
        />
    ));
