import { ThemeContext } from "@skbkontur/react-ui";
import { AddonsThemeIn } from "@skbkontur/react-ui-addons";
import { useContext } from "react";

export interface ApplicationTheme extends AddonsThemeIn {
    name: string;
    isDark: boolean;
    appBgColorPrimary: string;
    textColorSecondary: string;
    textColorDefault?: string;
    sideMenuBgColor?: string;
    sideMenuItemHoverBg?: string;
    sideMenuItemActiveBg?: string;
    iconCheckedColor: string;
    iconHoverColor: string;
    iconColor: string;
    headerMenuButtons: string;
    modalBackground?: string;
    headerBgColor?: string;
    appBgColorSecondary?: string;
    backgroundPlate?: string;
    dividerColor?: string;
    calendarFooterColor?: string;
    codeRef?: string;
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useTheme = (): any => {
    return useContext(ThemeContext);
};
