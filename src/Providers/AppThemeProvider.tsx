import React from "react";
import { ThemeContext } from "@skbkontur/react-ui";
import { useAppTheme } from "../hooks/themes/useAppThemeDetector";

interface AppThemeProviderProps {
    children: React.ReactNode;
}

export const AppThemeProvider: React.FC<AppThemeProviderProps> = ({ children }) => {
    const theme = useAppTheme();

    return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};
