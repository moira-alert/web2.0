import { DARK_THEME, ThemeFactory } from "@skbkontur/react-ui";
import { ApplicationTheme } from "../hooks/themes/useTheme";
import "@skbkontur/colors/colors.less";

export const defaultDark = ThemeFactory.create<ApplicationTheme>(
    {
        name: "Dark Theme",
        isDark: true,
        appBgColorPrimary: "var(--background-primary)",
        appBgColorSecondary: "var(--background-secondary)",
        appBgColorTertiary: "var(--background-tertiary)",
        kebabBackgroundHover: "var(--background-tertiary)",

        cmGutterColor: "var(--background-gutter)",
        cmLineNumberColor: "var(--line-number-gutter)",
        cmActiveLineGutter: "var(--active-line-gutter)",
        cmActiveLine: "var(--active-line)",

        headerMenuButtons: "var(--header-menu-buttons)",
        textColorDefault: "#e6e6e6",
        textColorSecondary: "var(--text-secondary)",

        iconCheckedColor: "var(--icon-checked-color)",
        iconHoverColor: "var(--icon-hover-color)",
        iconColor: "var(--icon-color)",

        inputBg: "var(--background-secondary)",
        textareaBg: "var(--background-secondary)",

        tabColorFocus: "#e6e6e6",
        tabColorHover: "var(--text-secondary)",

        backgroundPlate: "var(--background-plate)",
        dividerColor: "#eee",

        itemHover: "var(--item-hover)",

        sidePageBgDefault: "var(--background-secondary)",

        modalBackBg: "rgb(0, 0, 0)",

        calendarFooterColor: "var(--background-secondary)",

        chartGridLinesColor: "#505050",
    },
    DARK_THEME
);
