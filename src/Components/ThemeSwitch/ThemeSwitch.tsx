import React from "react";
import { Sun } from "./Components/Sun";
import { Desktop } from "./Components/Desktop";
import { Crescent } from "./Components/Crescent";
import { ThemeSwitchRadio } from "./Components/ThemeSwitchRadio/ThemeSwitchRadio";
import { EThemesNames } from "../../Themes/themesNames";
import classNames from "classnames/bind";

import styles from "./ThemeSwitch.module.less";

const cn = classNames.bind(styles);

interface IThemeSwitch {
    onThemeChange: (newTheme: EThemesNames) => void;
    currentTheme: string;
}

export const ThemeSwitch = ({ onThemeChange, currentTheme }: IThemeSwitch) => {
    return (
        <div className={cn("themeSwitch")}>
            <div className={cn("iconsContainer")}>
                <ThemeSwitchRadio
                    onThemeChange={onThemeChange}
                    currentThemeName={currentTheme}
                    themeName={EThemesNames.Light}
                    text={"Light"}
                    renderIcon={(color) => <Sun size={32} color={color} />}
                />

                <p className={cn("firstLine")} />

                <ThemeSwitchRadio
                    onThemeChange={onThemeChange}
                    currentThemeName={currentTheme}
                    themeName={EThemesNames.System}
                    text={"System"}
                    renderIcon={(color) => <Desktop size={32} color={color} />}
                />

                <p className={cn("secondLine")} />

                <ThemeSwitchRadio
                    onThemeChange={onThemeChange}
                    currentThemeName={currentTheme}
                    themeName={EThemesNames.Dark}
                    text={"Dark"}
                    renderIcon={(color) => <Crescent size={32} color={color} />}
                />
            </div>
        </div>
    );
};
