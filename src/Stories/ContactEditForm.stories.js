// @flow
/* eslint-disable react/jsx-filename-extension, import/no-extraneous-dependencies */
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ValidationContainer } from "react-ui-validations";
import ContactEditForm from "../Components/ContactEditForm/ContactEditForm";
import { ContactTypes } from "../Domain/ContactType";
import contactConfigs from "./Data/ContactConfigs";

const commonProps = {
    onChange: action("onChange"),
    contactDescriptions: contactConfigs,
};

storiesOf("ContactEditForm", module)
    .addDecorator(story => <ValidationContainer>{story()}</ValidationContainer>)
    .add("EmptyForm", () => (
        <ContactEditForm
            {...commonProps}
            contactInfo={{
                type: null,
                value: "",
            }}
        />
    ))
    .add("PushoverType", () => (
        <ContactEditForm
            {...commonProps}
            contactInfo={{
                type: ContactTypes.pushover,
                value: "",
            }}
        />
    ))
    .add("TelegramType", () => (
        <ContactEditForm
            {...commonProps}
            contactInfo={{
                type: ContactTypes.telegram,
                value: "",
            }}
        />
    ));
