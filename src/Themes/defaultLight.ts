import { LIGHT_THEME, ThemeFactory } from "@skbkontur/react-ui";
import { ApplicationTheme } from "../hooks/themes/useTheme";
import { promQLHighlight } from "./promQLHighlight";
import { EThemesNames } from "./themesNames";

export const defaultLight = ThemeFactory.create<ApplicationTheme>(
    {
        name: EThemesNames.Light,
        isDark: false,
        cmGutterColor: "var(--background-gutter)",
        cmLineNumberColor: "var(--line-number-gutter)",
        cmActiveLineGutter: "var(--active-line-gutter)",
        cmActiveLine: "var(--active-line)",
        cmGutterBorder: "var(--border-gutter)",
        cmSelectionBackgroundColor: "var(--selection-background)",

        ...promQLHighlight,

        textColorDefault: "#151515",

        iconCheckedColor: "var(--icon-checked-color)",
        iconHoverColor: "var(--icon-hover-color)",
        iconColor: "var(--icon-color)",

        headerMenuButtons: "var(--header-menu-buttons)",

        teamCardBackgroundColor: "var(--background-primary)",

        chartTextItemsColor: "rgb(102, 102, 102)",
        chartGridLinesColor: "#E5E5E5",

        btnLinkTextDecorationColor: "transparent",
        linkTextDecorationColor: "transparent",
    },
    LIGHT_THEME
);
