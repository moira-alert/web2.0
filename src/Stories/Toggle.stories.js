// @flow
/* eslint-disable react/jsx-filename-extension, import/no-extraneous-dependencies */
import * as React from "react";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";
import Toggle from "../Components/Toggle/Toggle";

storiesOf("Toggle", module)
    .add("Default", () => <Toggle label="Toggle" onChange={action("onChange")} />)
    .add("Checked", () => <Toggle checked label="Toggle" onChange={action("onChange")} />);
