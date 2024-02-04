import * as React from "react";
import { action } from "@storybook/addon-actions";
import FormattedNumberInput from "../Components/FormattedNumberInput/FormattedNumberInput";

export default {
    title: "FormattedNumberInput",
};

export const Default = () => (
    <FormattedNumberInput width={200} value={null} onValueChange={action("onChange")} />
);

export const WithValue = () => (
    <FormattedNumberInput width={200} value={12.3456789} onValueChange={action("onChange")} />
);

export const WithEditFormat = () => (
    <FormattedNumberInput
        width={200}
        value={12.3456789}
        onValueChange={action("onChange")}
        editFormat="0[.]000"
    />
);

export const WithViewAndEditFormat = () => (
    <FormattedNumberInput
        width={200}
        value={12.3456789}
        onValueChange={action("onChange")}
        viewFormat="0[.]0"
        editFormat="0[.]000"
    />
);

export const WithCustomAlign = () => (
    <FormattedNumberInput
        width={200}
        align="right"
        value={12.3456789}
        onValueChange={action("onChange")}
    />
);
