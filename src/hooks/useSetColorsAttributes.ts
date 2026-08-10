import { useEffect } from "react";
import { EThemesNames } from "../Themes/themesNames";
import { MOIRA_BRAND_COLOR } from "../Constants/moiraBrandColor";

export const useSetColorsAttributes = (theme: string) => {
    useEffect(() => {
        const root = document.body;

        root.setAttribute("data-k-brand", MOIRA_BRAND_COLOR);
        root.setAttribute("data-k-accent", "gray");
        root.setAttribute("data-k-theme", theme === EThemesNames.Dark ? "dark" : "light");
    }, [theme]);
};
