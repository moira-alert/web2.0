import React from "react";
import OkIcon from "@skbkontur/react-icons/Ok";
import RouterLink from "../Components/RouterLink/RouterLink";
import { MemoryRouter } from "react-router-dom";

export default {
    title: "RouterLink",
    component: RouterLink,
    decorators: [(story: () => JSX.Element) => <MemoryRouter>{story()}</MemoryRouter>],
};

export const Default = () => <RouterLink to="/">Link</RouterLink>;

export const WithIcon = () => (
    <RouterLink to="/" icon={<OkIcon />}>
        Link
    </RouterLink>
);
