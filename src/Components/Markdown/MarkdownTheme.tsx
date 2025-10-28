import React, { FC, PropsWithChildren } from "react";
import { MarkdownThemeProvider } from "@skbkontur/markdown";
import { useTheme } from "../../Themes";

export const MarkdownTheme: FC<PropsWithChildren> = ({ children }) => {
    const theme = useTheme();
    const isDark = theme.isDark;

    return (
        <MarkdownThemeProvider
            value={{
                themeMode: isDark ? "dark" : "light",
                elementsFontSize: theme.fontSizeMedium,
                elementsLineHeight: theme.tabLineHeightMedium,
                reactUiTheme: theme,
                colors: {
                    brand: theme.textColorDefault,
                    disabledButton: theme.btnDisabledTextColor,
                    emojiPickerBackgroundRGBColor: theme.bgSecondary,
                    grayDefault: theme.gray,
                    link: theme.linkColor,
                    panelBg: theme.bgDefault,
                    text: theme.textColorDefault,
                    textInverse: theme.textInverted,
                },
            }}
        >
            {children}
        </MarkdownThemeProvider>
    );
};
