import React, { CSSProperties, ReactElement, useState } from "react";
import { useTheme } from "../../../../Themes";
import { EThemesNames } from "../../../../Themes/themesNames";
import classNames from "classnames/bind";

import styles from "./ThemeSwitchRadio.less";

const cn = classNames.bind(styles);

interface ThemeSwitchRadioProps {
    onThemeChange: (value: EThemesNames) => void;
    themeName: EThemesNames;
    text: string;
    renderIcon: (color: string) => ReactElement;
    currentThemeName: string;
}

export const ThemeSwitchRadio = (props: ThemeSwitchRadioProps) => {
    const { onThemeChange, themeName, text, renderIcon, currentThemeName } = props;

    const theme = useTheme();
    const [hover, setHover] = useState(false);

    let themeIconTextStyle: CSSProperties = { color: theme.iconColor };
    let iconColor = theme.iconColor;

    if (currentThemeName === themeName) {
        themeIconTextStyle = { color: theme.iconCheckedColor };
        iconColor = theme.iconCheckedColor;
    } else if (hover) {
        themeIconTextStyle = { color: theme.iconHoverColor };
        iconColor = theme.iconHoverColor;
    }

    return (
        <div
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={() => onThemeChange(themeName)}
        >
            <label className={cn("theme-icon")}>
                {renderIcon(iconColor)}
                <p style={themeIconTextStyle} className={cn("theme-icon-text")}>
                    {text}
                </p>
            </label>
        </div>
    );
};
