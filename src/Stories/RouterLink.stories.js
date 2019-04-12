// @flow
/* eslint-disable react/jsx-filename-extension, import/no-extraneous-dependencies */
import * as React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";
import OkIcon from "@skbkontur/react-icons/Ok";
import RouterLink from "../Components/RouterLink/RouterLink";

storiesOf("RouterLink", module)
    .addDecorator(StoryRouter())
    .add("Default", () => <RouterLink to="/">Link</RouterLink>)
    .add("With icon", () => (
        <RouterLink to="/" icon={<OkIcon />}>
            Link
        </RouterLink>
    ));
