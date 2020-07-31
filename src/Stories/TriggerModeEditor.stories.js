// @flow
/* eslint-disable react/jsx-filename-extension, import/no-extraneous-dependencies */
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import TriggerModeEditor from "../Components/TriggerModeEditor/TriggerModeEditor";

storiesOf("TriggerModeEditor", module)
    .addDecorator(story => (
        <div style={{ maxWidth: "650px" }}>
            <ValidationContainer>{story()}</ValidationContainer>
        </div>
    ))
    .add("rising", () => (
        <TriggerModeEditor
            triggerType="rising"
            expression=""
            validateExpression={action("validateExpression")}
            value={{ warn_value: null, error_value: null }}
            onChange={action("onChange")}
        />
    ))
    .add("rising with value", () => (
        <TriggerModeEditor
            triggerType="rising"
            expression=""
            validateExpression={action("validateExpression")}
            value={{ warn_value: 1, error_value: 2 }}
            onChange={action("onChange")}
        />
    ))
    .add("falling", () => (
        <TriggerModeEditor
            triggerType="falling"
            expression=""
            validateExpression={action("validateExpression")}
            value={{ warn_value: null, error_value: null }}
            onChange={action("onChange")}
        />
    ))
    .add("falling with value", () => (
        <TriggerModeEditor
            triggerType="falling"
            expression=""
            validateExpression={action("validateExpression")}
            value={{ warn_value: 2, error_value: 1 }}
            onChange={action("onChange")}
        />
    ))
    .add("expression", () => (
        <TriggerModeEditor
            triggerType="expression"
            expression=""
            validateExpression={action("validateExpression")}
            value={{ warn_value: null, error_value: null }}
            onChange={action("onChange")}
        />
    ))
    .add("expression with value", () => (
        <TriggerModeEditor
            triggerType="expression"
            expression="t1 >= 10 ? ERROR : (t1 >= 1 ? WARN : OK)"
            validateExpression={action("validateExpression")}
            value={{ warn_value: null, error_value: null }}
            onChange={action("onChange")}
        />
    ))
    .add("expression with disabled simple mode", () => (
        <TriggerModeEditor
            triggerType="expression"
            expression="t1 >= 10 ? ERROR : (t1 >= 1 ? WARN : OK)"
            validateExpression={action("validateExpression")}
            disableSimpleMode
            value={{ warn_value: null, error_value: null }}
            onChange={action("onChange")}
        />
    ));
