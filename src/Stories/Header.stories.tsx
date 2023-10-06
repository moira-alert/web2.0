import * as React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import Header from "../Components/Header/Header";

storiesOf("Header", module)
    .addDecorator(StoryRouter())
    .add("Default", () => <Header />);
