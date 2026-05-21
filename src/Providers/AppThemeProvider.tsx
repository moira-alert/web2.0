import type { ReactNode, FC } from "react";
import { ThemeContext } from "@skbkontur/react-ui";
import { useAppTheme } from "../hooks/themes/useAppThemeDetector";

interface AppThemeProviderProps {
    children: ReactNode;
}

export const AppThemeProvider: FC<AppThemeProviderProps> = ({ children }) => {
    const theme = useAppTheme();

    return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
};
