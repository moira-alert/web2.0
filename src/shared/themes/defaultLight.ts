import { DEFAULT_THEME, ThemeFactory } from "@skbkontur/react-ui";
import { ApplicationTheme } from "./useTheme";

export const defaultLight = ThemeFactory.create<ApplicationTheme>(
    {
        name: "Light Theme",
        isDark: false,
        appBgColorPrimary: "#ffffff",
        textColorSecondary: "var(--text-secondary)",

        sidePageBgDefault: "#ffffff",
        sidePageCloseButtonColor: "#3d3d3d",

        // tabColorFocus: "@text-primary",
        // tabColorHover: "@text-secondary",
        iconCheckedColor: "#00A8FF",
        iconHoverColor: "black",
        iconColor: "#858585",
        headerMenuButtons: "#fff",
    },
    DEFAULT_THEME
);
