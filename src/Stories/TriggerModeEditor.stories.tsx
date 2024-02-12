import * as React from "react";
import { action } from "@storybook/addon-actions";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { TriggerModeEditor } from "../Components/TriggerModeEditor/TriggerModeEditor";
import { Meta } from "@storybook/react";

const meta: Meta = {
    title: "TriggerModeEditor",
    decorators: [
        (story) => (
            <div style={{ maxWidth: "650px" }}>
                <ValidationContainer>{story()}</ValidationContainer>
            </div>
        ),
    ],
};

export const Rising = {
    render: () => (
        <TriggerModeEditor
            triggerType="rising"
            expression=""
            validateExpression={() => undefined}
            value={{ warn_value: null, error_value: null }}
            onChange={action("onChange")}
        />
    ),

    name: "rising",
};

export const RisingWithValue = {
    render: () => (
        <TriggerModeEditor
            triggerType="rising"
            expression=""
            validateExpression={() => undefined}
            value={{ warn_value: 1, error_value: 2 }}
            onChange={action("onChange")}
        />
    ),

    name: "rising with value",
};

export const Falling = {
    render: () => (
        <TriggerModeEditor
            triggerType="falling"
            expression=""
            validateExpression={() => undefined}
            value={{ warn_value: null, error_value: null }}
            onChange={action("onChange")}
        />
    ),

    name: "falling",
};

export const FallingWithValue = {
    render: () => (
        <TriggerModeEditor
            triggerType="falling"
            expression=""
            validateExpression={() => undefined}
            value={{ warn_value: 2, error_value: 1 }}
            onChange={action("onChange")}
        />
    ),

    name: "falling with value",
};

export const Expression = {
    render: () => (
        <TriggerModeEditor
            triggerType="expression"
            expression=""
            validateExpression={() => undefined}
            value={{ warn_value: null, error_value: null }}
            onChange={action("onChange")}
        />
    ),

    name: "expression",
};

export const ExpressionWithValue = {
    render: () => (
        <TriggerModeEditor
            triggerType="expression"
            expression="t1 >= 10 ? ERROR : (t1 >= 1 ? WARN : OK)"
            validateExpression={() => undefined}
            value={{ warn_value: null, error_value: null }}
            onChange={action("onChange")}
        />
    ),

    name: "expression with value",
};

export const ExpressionWithDisabledSimpleMode = {
    render: () => (
        <TriggerModeEditor
            triggerType="expression"
            expression="t1 >= 10 ? ERROR : (t1 >= 1 ? WARN : OK)"
            validateExpression={() => undefined}
            disableSimpleMode
            value={{ warn_value: null, error_value: null }}
            onChange={action("onChange")}
        />
    ),

    name: "expression with disabled simple mode",
};

export default meta;
