import { DARK_THEME, ThemeFactory } from "@skbkontur/react-ui";
import { ApplicationTheme } from "../hooks/themes/useTheme";

export const defaultDark = ThemeFactory.create<ApplicationTheme>(
    {
        name: "Dark Theme",
        isDark: true,

        appBgColorSecondary: "var(--background-secondary)",
        appBgColorTertiary: "var(--background-tertiary)",

        cmGutterColor: "var(--background-gutter)",
        cmLineNumberColor: "var(--line-number-gutter)",
        cmActiveLineGutter: "var(--active-line-gutter)",
        cmActiveLine: "var(--active-line)",
        cmGutterBorder: "var(--border-gutter)",

        headerMenuButtons: "var(--header-menu-buttons)",

        textColorDefault: "#e6e6e6",

        iconCheckedColor: "var(--icon-checked-color)",
        iconHoverColor: "var(--icon-hover-color)",
        iconColor: "var(--icon-color)",

        inputBg: "var(--background-secondary)",
        textareaBg: "var(--background-secondary)",

        tabColorFocus: "var(--text-primary)",
        tabColorHover: "var(--text-secondary)",

        sidePageBgDefault: "var(--background-secondary)",

        modalBackBg: "rgb(0, 0, 0)",

        chartGridLinesColor: "#505050",

        teamCardBackgroundColor: "var(--background-secondary)",
    },
    DARK_THEME
);
