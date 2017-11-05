// @flow
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
        return (
            <div>
                <TriggerSimpleModeEditor
                    value={this.state.value}
                    onChange={nextValue => this.setState({ value: nextValue })}
                />
                <div>
                    <pre>{JSON.stringify(this.state.value, null, "  ")}</pre>
                </div>
            </div>
        );
    }
}

storiesOf("TriggerSimpleModeEditor", module)
    .addDecorator(story => <ValidationContainer>{story()}</ValidationContainer>)
    .add("Simple", () => (
        <TriggerSimpleModeEditor value={{ warn_value: 10, error_value: 20 }} onChange={action("onChange")} />
    ))
    .add("StateFull_NullInitialValue", () => (
        <TriggerSimpleModeEditorContainer initialValue={{ warn_value: null, error_value: null }} />
    ));
