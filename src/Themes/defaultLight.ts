import { DEFAULT_THEME, ThemeFactory } from "@skbkontur/react-ui";
import { ApplicationTheme } from "../hooks/themes/useTheme";

export const defaultLight = ThemeFactory.create<ApplicationTheme>(
    {
        name: "Light Theme",
        isDark: false,
        appBgColorPrimary: "var(--background-primary)",
        textColorSecondary: "var(--text-secondary)",

        iconCheckedColor: "var(--icon-checked-color)",
        iconHoverColor: "var(--icon-hover-color)",
        iconColor: "var(--icon-color)",

        headerMenuButtons: "var(--header-menu-buttons)",
        cmGutterColor: "var(--background-gutter)",
        cmLineNumberColor: "var(--line-number-gutter)",
        cmGutterBorder: "var(--border-gutter)",

        itemHover: "var(--item-hover)",
    },
    DEFAULT_THEME
);
