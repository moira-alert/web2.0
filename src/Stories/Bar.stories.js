// @flow
/* eslint-disable react/jsx-filename-extension, import/no-extraneous-dependencies */
import * as React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import Bar from "../Components/Bar/Bar";

storiesOf("Bar", module)
    .addDecorator(StoryRouter())
    .add("Default", () => <Bar message="You message here" />);
