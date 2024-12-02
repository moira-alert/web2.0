import "reflect-metadata";
import "../src/style.less";
import { MemoryRouter } from "react-router";
import React, { useEffect } from "react";
import { Providers } from "../src/Providers/Providers";
import { EThemesNames } from "../src/Themes/themesNames";

export const decorators = [
    (Story) => {
        useEffect(() => {
            document.body.setAttribute("data-theme", EThemesNames.Light);
        }, []);
        return (
            <MemoryRouter initialEntries={["/"]}>
                <Providers>
                    <Story />
                </Providers>
            </MemoryRouter>
        );
    },
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
