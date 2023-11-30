import * as React from "react";
import { storiesOf } from "@storybook/react";
import AddingButton from "../Components/AddingButton/AddingButton";

storiesOf("AddingButton", module).add("Default", () => <AddingButton to="/" />);
