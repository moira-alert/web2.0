import { ThemeContext } from "@skbkontur/react-ui";
import { LIGHT_THEME } from "@skbkontur/react-ui";
import { useContext } from "react";
import { ThemeIn } from "@skbkontur/react-ui/lib/theming/Theme";
export interface ApplicationTheme extends ThemeIn {
    name: string;
    isDark: boolean;

    chartTextItemsColor: string;
    chartGridLinesColor: string;

    appBgColorSecondary?: string;
    appBgColorTertiary?: string;

    textColorDefault?: string;
    textInverted: string;

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
    cmGutterBorder?: string;
    cmSelectionBackgroundColor?: string;

    promQLLabelName: string;
    promQLString: string;
    promQLOperatorKeyword: string;
    promQLNumber: string;
    promQLModifier: string;
}

export type TTheme = Readonly<Readonly<typeof LIGHT_THEME> & ApplicationTheme>;

export const useTheme = (): TTheme => {
    return useContext(ThemeContext) as TTheme;
};
