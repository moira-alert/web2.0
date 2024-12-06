import { defaultDark, defaultLight } from "../../Themes";
import { EThemesNames } from "../../Themes/themesNames";
import { useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";
import { useIsBrowserPrefersDarkTheme } from "./useIsBrowserPrefersDarkTheme";

export const useAppTheme = () => {
    const isBrowserDarkThemeEnabled = useIsBrowserPrefersDarkTheme();
    const { theme } = useAppSelector(UIState);

    switch (theme) {
        case EThemesNames.Light:
            return defaultLight;
        case EThemesNames.Dark:
            return defaultDark;
        case EThemesNames.System:
            return isBrowserDarkThemeEnabled ? defaultDark : defaultLight;
        default:
            return isBrowserDarkThemeEnabled ? defaultDark : defaultLight;
    }
};
