// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-router";
import Bar from "../Components/Bar/Bar";

storiesOf("Bar", module)
    .addDecorator(StoryRouter())
    .add("Default", () => <Bar message="Test message" />);
