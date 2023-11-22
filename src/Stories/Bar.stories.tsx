import * as React from "react";
import { storiesOf } from "@storybook/react";
import Bar from "../Components/Bar/Bar";

storiesOf("Bar", module).add("Default", () => <Bar message="You message here" />);
