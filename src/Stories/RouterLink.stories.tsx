import * as React from "react";
import { storiesOf } from "@storybook/react";
import OkIcon from "@skbkontur/react-icons/Ok";
import RouterLink from "../Components/RouterLink/RouterLink";

storiesOf("RouterLink", module)
    .add("Default", () => <RouterLink to="/">Link</RouterLink>)
    .add("With icon", () => (
        <RouterLink to="/" icon={<OkIcon />}>
            Link
        </RouterLink>
    ));
