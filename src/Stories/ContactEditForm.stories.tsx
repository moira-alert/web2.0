import * as React from "react";
import { action } from "@storybook/addon-actions";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import ContactEditForm from "../Components/ContactEditForm/ContactEditForm";
import contactConfigs from "./Data/ContactConfigs";
import { Meta } from "@storybook/react";
import { Providers } from "../Providers/Providers";
import { setConfig, setContactItems } from "../store/Reducers/ConfigReducer.slice";
import { ContactTypes } from "../Domain/Contact";
import { store } from "../store/store";

const commonProps = {
    onChange: action("onChange"),
    contactDescriptions: contactConfigs,
};

const meta: Meta = {
    title: "ContactEditForm",
    component: ContactEditForm,
    decorators: [
        (story) => (
            <Providers>
                <ValidationContainer>{story()}</ValidationContainer>
            </Providers>
        ),
    ],
};

const initializeStore = () => {
    const contacts = [
        {
            type: ContactTypes.email,
            label: "E-mail",
        },
    ];

    store.dispatch(
        setConfig({
            contacts,
            supportEmail: "",
            featureFlags: {
                isPlottingDefaultOn: true,
                isPlottingAvailable: true,
                isSubscriptionToAllTagsAvailable: true,
                celebrationMode: "",
                isReadonlyEnabled: false,
            },
            sentry: {},
            remoteAllowed: true,
            metric_source_clusters: [],
        })
    );

    store.dispatch(setContactItems(contacts));
};

export const Empty = {
    render: () => <ContactEditForm {...commonProps} contactInfo={null} />,
};

export const Filled = {
    render: () => {
        initializeStore();
        return (
            <ContactEditForm
                onChange={action("onChange")}
                contactInfo={{
                    type: "email",
                    value: "test@email",
                    id: "",
                }}
            />
        );
    },
};

export default meta;
