import React from "react";
import { action } from "@storybook/addon-actions";
import Toggle from "../Components/Toggle/Toggle";

export default {
    title: "Toggle",
    component: Toggle,
};

export const Default = () => <Toggle label="Toggle" onChange={action("onChange")} />;

export const Checked = () => <Toggle checked label="Toggle" onChange={action("onChange")} />;
