import { DARK_THEME, ThemeFactory } from "@skbkontur/react-ui";
import { ApplicationTheme } from "./useTheme";
import "@skbkontur/colors/colors.less";

export const defaultDark = ThemeFactory.create<ApplicationTheme>(
    {
        name: "Dark Theme",
        isDark: true,
        appBgColorPrimary: "var(--background-primary)",
        appBgColorSecondary: "var(--background-secondary)",
        sideMenuBgColor: "var(--background-secondary)",

        headerMenuButtons: "#fff",
        textColorDefault: "#e6e6e6",
        textColorSecondary: "var(--text-secondary)",

        sideMenuItemHoverBg: "var(--background-item-active)",
        sideMenuItemActiveBg: "var(--background-primary)",
        sidePageBackingBg: "#222",

        sidePageBgDefault: "var(--background-primary)",
        sidePageCloseButtonColor: "var(--background-inverted)",

        inputBg: "var(--background-secondary)",
        textareaBg: "var(--background-secondary)",

        tabColorFocus: "var(--text-primary)",
        tabColorHover: "var(--text-secondary)",

        codeRef: "#505050",

        modalBg: "var(--background-secondary)",
        iconCheckedColor: "#00A8FF",
        iconHoverColor: "white",
        iconColor: "#858585",
        modalBackBg: "rgb(0, 0, 0)",
        backgroundPlate: "var(--background-plate)",
        dividerColor: "#eee",

        calendarFooterColor: "var(--background-secondary)",
    },
    DARK_THEME
);
