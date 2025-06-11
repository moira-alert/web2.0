import * as React from "react";
import DeleteIcon from "@skbkontur/react-icons/Delete";
import ColorHash from "color-hash";
import { useAppTheme } from "../../hooks/themes/useAppThemeDetector";
import classNames from "classnames/bind";

import styles from "./Tag.module.less";

const cn = classNames.bind(styles);

type Props = {
    title: string;
    focus?: boolean;
    onClick?: () => void;
    onRemove?: (title: string) => void;
    "data-tid"?: string;
};

type ColorTheme = {
    backgroundColor: string;
    color: string;
};

export function getColor(title: string, isDark?: boolean): ColorTheme {
    const getBgColor = new ColorHash({
        lightness: isDark ? 0.4 : 0.6,
        saturation: isDark ? 0.2 : 0.25,
    });

    const getTextColor = new ColorHash({
        lightness: 0.98,
        saturation: 0,
    });

    return {
        backgroundColor: getBgColor.hex(title),
        color: getTextColor.hex(title),
    };
}

export default function Tag(props: Props): React.ReactElement {
    const { title, focus, onRemove, onClick, "data-tid": dataTid } = props;
    const theme = useAppTheme();
    const color = getColor(title, theme.isDark);

    if (typeof onClick === "function") {
        return (
            <div className={cn({ tag: true, clickable: true, focused: focus })} style={color}>
                <button
                    type="button"
                    onClick={onClick}
                    className={cn("title", "clickable")}
                    data-tid={dataTid}
                >
                    {title}
                </button>
            </div>
        );
    }

    if (typeof onRemove === "function") {
        const handleRemove = () => {
            onRemove(title);
        };

        return (
            <div className={cn({ tag: true, removeable: true, focused: focus })} style={color}>
                <div className={cn("title")}>{title}</div>
                <button type="button" className={cn("remove")} onClick={handleRemove}>
                    <DeleteIcon />
                </button>
            </div>
        );
    }

    return (
        <div className={cn({ tag: true, removeable: onRemove, focused: focus })} style={color}>
            <div className={cn("title")}>{title}</div>
        </div>
    );
}
