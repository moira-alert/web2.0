import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import FormattedNumberInput from "../Components/FormattedNumberInput/FormattedNumberInput";

storiesOf("FormattedNumberInput", module)
    .add("Default", () => (
        <FormattedNumberInput width={200} value={null} onChange={action("onChange")} />
    ))
    .add("With value", () => (
        <FormattedNumberInput width={200} value={12.3456789} onChange={action("onChange")} />
    ))
    .add("With edit format", () => (
        <FormattedNumberInput
            width={200}
            value={12.3456789}
            onChange={action("onChange")}
            editFormat="0[.]000"
        />
    ))
    .add("With view and edit format", () => (
        <FormattedNumberInput
            width={200}
            value={12.3456789}
            onChange={action("onChange")}
            viewFormat="0[.]0"
            editFormat="0[.]000"
        />
    ))
    .add("With custom align", () => (
        <FormattedNumberInput
            width={200}
            align="right"
            value={12.3456789}
            onChange={action("onChange")}
        />
    ));
