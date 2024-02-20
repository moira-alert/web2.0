import * as React from "react";
import OkIcon from "@skbkontur/react-icons/Ok";
import RouterLink from "../Components/RouterLink/RouterLink";

export default {
    title: "RouterLink",
};

export const Default = () => <RouterLink to="/">Link</RouterLink>;

export const WithIcon = {
    render: () => (
        <RouterLink to="/" icon={<OkIcon />}>
            Link
        </RouterLink>
    ),

    name: "With icon",
};
