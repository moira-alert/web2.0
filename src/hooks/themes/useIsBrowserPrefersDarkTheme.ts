import { useEffect, useState } from "react";

export const useIsBrowserPrefersDarkTheme = () => {
    const getCurrentTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches;
    const [isDarkTheme, setIsDarkTheme] = useState(getCurrentTheme());

    const mqListener = (e: MediaQueryListEvent) => {
        setIsDarkTheme(e.matches);
    };

    useEffect(() => {
        const darkThemeMq = window.matchMedia("(prefers-color-scheme: dark)");

        try {
            darkThemeMq.addEventListener("change", mqListener);
        } catch (e) {
            console.warn("Unable to add theme change listener", e);
        }
        return () => {
            try {
                darkThemeMq.removeEventListener("change", mqListener);
            } catch (e) {
                console.warn("Unable to remove theme change listener", e);
            }
        };
    }, []);

    return isDarkTheme;
};
