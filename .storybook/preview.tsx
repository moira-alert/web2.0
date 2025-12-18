import "reflect-metadata";
import "../src/style.less";
import { MemoryRouter } from "react-router";
import { Providers } from "../src/Providers/Providers";
import React from "react";
import { useAppDispatch } from "../src/store/hooks";
import { setTheme } from "../src/store/Reducers/UIReducer.slice";
import { EThemesNames } from "../src/Themes/themesNames";
import "../src/style.less";

export const globalTypes = {
    theme: {
        name: "Theme",
        defaultValue: "Light",
        toolbar: {
            icon: "circlehollow",
            items: ["Light", "Dark"],
        },
    },
};

const ThemeSync: React.FC<{ theme: "Light" | "Dark" }> = ({ theme }) => {
    const dispatch = useAppDispatch();
    dispatch(setTheme(theme === "Dark" ? EThemesNames.Dark : EThemesNames.Light));
    document.body.setAttribute("data-theme", theme === "Dark" ? "Dark Theme" : "Light Theme");
    return null;
};

export const decorators = [
    (Story, context) => {
        const theme = context.globals.theme;

        return (
            <MemoryRouter initialEntries={["/"]}>
                <Providers>
                    <ThemeSync theme={theme} />
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
