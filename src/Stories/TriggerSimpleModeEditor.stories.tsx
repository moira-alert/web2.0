import React from "react";
import { action } from "@storybook/addon-actions";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import TriggerSimpleModeEditor from "../Components/TriggerSimpleModeEditor/TriggerSimpleModeEditor";

export default {
    title: "TriggerSimpleModeEditor",
    component: TriggerSimpleModeEditor,
    decorators: [
        (story: () => JSX.Element) => <ValidationContainer>{story()}</ValidationContainer>,
    ],
};

export const Rising = () => (
    <TriggerSimpleModeEditor
        watchFor="rising"
        risingValues={{ warn_value: 10, error_value: 20 }}
        fallingValues={{ warn_value: null, error_value: null }}
        onChange={action("onChange")}
        onSwitch={action("onSwitch")}
    />
);

export const Falling = () => (
    <TriggerSimpleModeEditor
        watchFor="falling"
        risingValues={{ warn_value: null, error_value: null }}
        fallingValues={{ warn_value: 20, error_value: 10 }}
        onChange={action("onChange")}
        onSwitch={action("onSwitch")}
    />
);

export const BothValues = () => (
    <TriggerSimpleModeEditor
        watchFor="rising"
        risingValues={{ warn_value: 10, error_value: 20 }}
        fallingValues={{ warn_value: 20, error_value: 10 }}
        onChange={action("onChange")}
        onSwitch={action("onSwitch")}
    />
);
