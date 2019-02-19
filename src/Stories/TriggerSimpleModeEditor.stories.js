// @flow
/* eslint-disable react/jsx-filename-extension, import/no-extraneous-dependencies */
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ValidationContainer } from "react-ui-validations";
import TriggerSimpleModeEditor, {
    type TriggerSimpleModeSettings,
} from "../Components/TriggerSimpleModeEditor/TriggerSimpleModeEditor";

type Props = {
    initialValue: TriggerSimpleModeSettings,
};

type State = {
    value: TriggerSimpleModeSettings,
};

class TriggerSimpleModeEditorContainer extends React.Component<Props, State> {
    props: Props;

    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            value: props.initialValue,
        };
    }

    render(): React.Node {
        const { value } = this.state;
        return (
            <div>
                <TriggerSimpleModeEditor
                    triggerType="rising"
                    value={value}
                    onChange={nextValue => this.setState({ value: nextValue })}
                />
                <div>
                    <pre>{JSON.stringify(value, null, "  ")}</pre>
                </div>
            </div>
        );
    }
}

storiesOf("TriggerSimpleModeEditor", module)
    .addDecorator(story => <ValidationContainer>{story()}</ValidationContainer>)
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
