// @flow
import * as React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-router";
import RouterLink from "../Components/RouterLink/RouterLink";

storiesOf("RouterLink", module)
    .addDecorator(StoryRouter())
    .add("Default", () => <RouterLink to="/">Link</RouterLink>)
    .add("With icon", () => (
        <RouterLink to="/" icon="Ok">
            Link
        </RouterLink>
    ));
