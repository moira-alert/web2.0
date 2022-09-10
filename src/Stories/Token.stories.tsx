import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Token from "../Components/Token/Token";

storiesOf("Token", module)
    .addDecorator((story) => <div style={{ margin: 20 }}>{story()}</div>)
    .add("removable", () => (
        <Token type="removable" onRemove={action("onRemove")}>
            dev
        </Token>
    ))
    .add("selectable", () => (
        <Token type="selectable" onClick={action("handleClick")}>
            dev
        </Token>
    ));
