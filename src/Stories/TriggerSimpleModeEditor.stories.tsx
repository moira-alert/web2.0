import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import TriggerSimpleModeEditor from "../Components/TriggerSimpleModeEditor/TriggerSimpleModeEditor";

storiesOf("TriggerSimpleModeEditor", module)
    .addDecorator((story) => <ValidationContainer>{story()}</ValidationContainer>)
    .add("Rising", () => (
        <TriggerSimpleModeEditor
            watchFor="rising"
            risingValues={{ warn_value: 10, error_value: 20 }}
            fallingValues={{ warn_value: null, error_value: null }}
            onChange={action("onChange")}
            onSwitch={action("onSwitch")}
        />
    ))
    .add("Falling", () => (
        <TriggerSimpleModeEditor
            watchFor="falling"
            risingValues={{ warn_value: null, error_value: null }}
            fallingValues={{ warn_value: 20, error_value: 10 }}
            onChange={action("onChange")}
            onSwitch={action("onSwitch")}
        />
    ))
    .add("Both values", () => (
        <TriggerSimpleModeEditor
            watchFor="rising"
            risingValues={{ warn_value: 10, error_value: 20 }}
            fallingValues={{ warn_value: 20, error_value: 10 }}
            onChange={action("onChange")}
            onSwitch={action("onSwitch")}
        />
    ));
