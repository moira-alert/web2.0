import { useEffect } from "react";
import { EThemesNames } from "../../Themes/themesNames";
import { useAppSelector } from "../../store/hooks";
import { useFeatureFlag } from "./useFeatureFlag";
import { useIsBrowserPrefersDarkTheme } from "./useIsBrowserPrefersDarkTheme";
import { UIState } from "../../store/selectors";

export type TFeatureFlag<T> = {
    id: string;
    label: string;
    defaultValue: T;
};

const ThemeFlag: TFeatureFlag<string> = {
    id: "theme",
    label: "Application theme",
    defaultValue: "System Theme",
};

export const useThemeFeature = () => {
    const isBrowserDarkThemeEnabled = useIsBrowserPrefersDarkTheme();
    const { theme } = useAppSelector(UIState);
    const localValue = theme;

    useEffect(() => {
        const isSystemTheme = localValue === EThemesNames.System;
        const browserTheme = isBrowserDarkThemeEnabled ? EThemesNames.Dark : EThemesNames.Light;

        const resultTheme = isSystemTheme ? browserTheme : localValue;

        document.body.dataset.theme = resultTheme;
    }, [localValue]);

    return useFeatureFlag<EThemesNames>({ ...ThemeFlag, defaultValue: localValue });
};
