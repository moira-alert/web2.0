import * as React from "react";
import { action } from "@storybook/addon-actions";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import ContactEditForm from "../Components/ContactEditForm/ContactEditForm";
import contactConfigs from "./Data/ContactConfigs";
import { Meta } from "@storybook/react";
import { Providers } from "../Providers/Providers";
import { useAppDispatch } from "../store/hooks";
import { setConfig } from "../store/Reducers/ConfigReducer.slice";
import { ContactTypes } from "../Domain/Contact";

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

export const Empty = {
    render: () => <ContactEditForm {...commonProps} contactInfo={null} />,
};

const FilledContactEditForm: React.FC = () => {
    const dispatch = useAppDispatch();

    React.useEffect(() => {
        dispatch(
            setConfig({
                contacts: [
                    {
                        type: ContactTypes.email,
                        label: "E-mail",
                    },
                ],
                supportEmail: "",
                featureFlags: {
                    isPlottingDefaultOn: true,
                    isPlottingAvailable: true,
                    isSubscriptionToAllTagsAvailable: true,
                },
                metric_source_clusters: [],
            })
        );
    }, []);

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
};

export const Filled = {
    render: () => <FilledContactEditForm />,
};

export default meta;
