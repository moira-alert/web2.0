import React from "react";
import { action } from "@storybook/addon-actions";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import TriggerModeEditor from "../Components/TriggerModeEditor/TriggerModeEditor";

export default {
    title: "TriggerModeEditor",
    component: TriggerModeEditor,
    decorators: [
        (story: () => JSX.Element) => (
            <div style={{ maxWidth: "650px" }}>
                <ValidationContainer>{story()}</ValidationContainer>
            </div>
        ),
    ],
};

export const Rising = () => (
    <TriggerModeEditor
        triggerType="rising"
        expression=""
        validateExpression={() => undefined}
        value={{ warn_value: null, error_value: null }}
        onChange={action("onChange")}
    />
);

export const RisingWithValue = () => (
    <TriggerModeEditor
        triggerType="rising"
        expression=""
        validateExpression={() => undefined}
        value={{ warn_value: 1, error_value: 2 }}
        onChange={action("onChange")}
    />
);

export const Falling = () => (
    <TriggerModeEditor
        triggerType="falling"
        expression=""
        validateExpression={() => undefined}
        value={{ warn_value: null, error_value: null }}
        onChange={action("onChange")}
    />
);

export const FallingWithValue = () => (
    <TriggerModeEditor
        triggerType="falling"
        expression=""
        validateExpression={() => undefined}
        value={{ warn_value: 2, error_value: 1 }}
        onChange={action("onChange")}
    />
);

export const Expression = () => (
    <TriggerModeEditor
        triggerType="expression"
        expression=""
        validateExpression={() => undefined}
        value={{ warn_value: null, error_value: null }}
        onChange={action("onChange")}
    />
);

export const ExpressionWithValue = () => (
    <TriggerModeEditor
        triggerType="expression"
        expression="t1 >= 10 ? ERROR : (t1 >= 1 ? WARN : OK)"
        validateExpression={() => undefined}
        value={{ warn_value: null, error_value: null }}
        onChange={action("onChange")}
    />
);
