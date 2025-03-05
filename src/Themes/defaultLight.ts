import { DEFAULT_THEME, ThemeFactory } from "@skbkontur/react-ui";
import { ApplicationTheme } from "../hooks/themes/useTheme";
import { promQLHighlight } from "./promQLHighlight";

export const defaultLight = ThemeFactory.create<ApplicationTheme>(
    {
        name: "Light Theme",
        isDark: false,
        cmGutterColor: "var(--background-gutter)",
        cmLineNumberColor: "var(--line-number-gutter)",
        cmActiveLineGutter: "var(--active-line-gutter)",
        cmActiveLine: "var(--active-line)",
        cmGutterBorder: "var(--border-gutter)",

        ...promQLHighlight,

        textColorDefault: "#151515",

        iconCheckedColor: "var(--icon-checked-color)",
        iconHoverColor: "var(--icon-hover-color)",
        iconColor: "var(--icon-color)",

        headerMenuButtons: "var(--header-menu-buttons)",

        teamCardBackgroundColor: "var(--background-primary)",
    },
    DEFAULT_THEME
);
