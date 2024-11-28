import React, { FC } from "react";
import { EThemesNames } from "../../../shared/themes/themesNames";
import { useTheme } from "../../../shared/themes";
import { Sun } from "../Sun";
import { Crescent } from "../Crescent";
import { Desktop } from "../Desktop";
import classNames from "classnames/bind";

import styles from "./ThemeSwitchIcon.less";

const cn = classNames.bind(styles);

interface IThemeSwitchIconProps {
    currentTheme: EThemesNames;
    onToggleThemeModal: () => void;
}

export const ThemeSwitchIcon: FC<IThemeSwitchIconProps> = ({
    currentTheme,
    onToggleThemeModal,
}) => {
    const theme = useTheme();

    const Icon = (() => {
        switch (currentTheme) {
            case EThemesNames.Light:
                return (
                    <>
                        <span className={cn("icon")} style={{ color: theme.textColorDefault }}>
                            <Sun size={20} color={theme.headerMenuButtons} />
                        </span>
                        Light
                    </>
                );
            case EThemesNames.Dark:
                return (
                    <>
                        <span className={cn("icon")} style={{ color: theme.textColorDefault }}>
                            <Crescent size={20} color={theme.headerMenuButtons} />
                        </span>
                        Dark
                    </>
                );
            case EThemesNames.System:
                return (
                    <>
                        <span className={cn("icon")} style={{ color: theme.textColorDefault }}>
                            <Desktop size={20} color={theme.headerMenuButtons} />
                        </span>
                        System
                    </>
                );
            default:
                return null;
        }
    })();

    return (
        <span className={cn("icon-container")} onClick={onToggleThemeModal}>
            {Icon}
        </span>
    );
};