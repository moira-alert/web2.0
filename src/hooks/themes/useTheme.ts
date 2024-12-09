import { ThemeContext } from "@skbkontur/react-ui";
import { DefaultTheme } from "@skbkontur/react-ui/internal/themes/DefaultTheme";
import { useContext } from "react";
import { ThemeIn } from "@skbkontur/react-ui/lib/theming/Theme";
export interface ApplicationTheme extends ThemeIn {
    name: string;
    isDark: boolean;

    appBgColorSecondary?: string;
    appBgColorTertiary?: string;

    textColorDefault?: string;

    itemHover?: string;

    teamCardBackgroundColor: string;

    iconCheckedColor: string;
    iconHoverColor: string;
    iconColor: string;

    headerMenuButtons: string;

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
