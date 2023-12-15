import "reflect-metadata";
import "../src/style.less";
import { MemoryRouter } from "react-router";
import React from "react";

export const decorators = [
    (Story) => (
        <MemoryRouter initialEntries={["/"]}>
            <Story />
        </MemoryRouter>
    ),
];

export const parameters = {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    },
};
