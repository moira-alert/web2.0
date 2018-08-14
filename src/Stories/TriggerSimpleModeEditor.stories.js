// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
// import { ValidationContainer } from "react-ui-validations";
import { TriggerTypes } from "../Domain/Trigger";
import TriggerSimpleModeEditor from "../Components/TriggerSimpleModeEditor/TriggerSimpleModeEditor";

// type Props = {
//     initialValue: TriggerSimpleModeSettings,
// };

// type State = {
//     value: TriggerSimpleModeSettings,
// };

storiesOf("TriggerSimpleModeEditor", module)
    // .addDecorator(story => <ValidationContainer>{story()}</ValidationContainer>)
    .add("rising", () => (
        <TriggerSimpleModeEditor
            data={{
                trigger_type: TriggerTypes.RISING,
                warn_value: 1,
                error_value: 2,
            }}
            onTypeChange={action("onTypeChange")}
            onValueChange={action("onValueChange")}
        />
    ))
    .add("falling", () => (
        <TriggerSimpleModeEditor
            data={{
                trigger_type: TriggerTypes.FALLING,
                warn_value: 2,
                error_value: 1,
            }}
            onTypeChange={action("onTypeChange")}
            onValueChange={action("onValueChange")}
        />
    ));
