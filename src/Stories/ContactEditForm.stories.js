// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ValidationContainer } from "react-ui-validations";
import ContactEditForm from "../Components/ContactEditForm/ContactEditForm";

const commonProps = {
    onChange: action("onChange"),
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
                type: "pushover",
                value: "",
            }}
        />
    ))
    .add("TelegramType", () => (
        <ContactEditForm
            {...commonProps}
            contactInfo={{
                type: "telegram",
                value: "",
            }}
        />
    ));
