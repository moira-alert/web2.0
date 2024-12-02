import { ThemeContext } from "@skbkontur/react-ui";
import { AddonsThemeIn } from "@skbkontur/react-ui-addons";
import { DefaultTheme } from "@skbkontur/react-ui/internal/themes/DefaultTheme";
import { useContext } from "react";

export interface ApplicationTheme extends AddonsThemeIn {
    name: string;
    isDark: boolean;

    appBgColorPrimary: string;
    appBgColorSecondary?: string;
    appBgColorTertiary?: string;

    textColorSecondary?: string;
    textColorDefault?: string;

    itemHover?: string;

    iconCheckedColor: string;
    iconHoverColor: string;
    iconColor: string;

    modalBackground?: string;

    headerBgColor?: string;
    headerMenuButtons: string;

    backgroundPlate?: string;

    dividerColor?: string;

    calendarFooterColor?: string;

    cmGutterColor?: string;
    cmLineNumberColor?: string;
    cmActiveLineGutter?: string;
    cmActiveLine?: string;
    chartGridLinesColor?: string;
    cmGutterBorder?: string;
}

export type TTheme = Readonly<Readonly<typeof DefaultTheme> & ApplicationTheme>;

export const useTheme = (): TTheme => {
    return useContext(ThemeContext) as TTheme;
};
