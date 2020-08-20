// @flow
import * as React from "react";
import DeleteIcon from "@skbkontur/react-icons/Delete";
import ColorHash from "color-hash";
import cn from "./Tag.less";

type Props = {|
    title: string,
    focus?: boolean,
    onClick?: () => void,
    onRemove?: string => void,
    "data-tid"?: string,
|};

type ColorTheme = {|
    backgroundColor: string,
    color: string,
|};

function getColor(title: string): ColorTheme {
    const getBgColor = new ColorHash({ lightness: 0.6, saturation: 0.25 });
    const getTextColor = new ColorHash({ lightness: 0.98, saturation: 0 });
    return {
        backgroundColor: getBgColor.hex(title),
        color: getTextColor.hex(title),
    };
}

export default function Tag(props: Props): React.Node {
    const { title, focus, onRemove, onClick, "data-tid": dataTid } = props;

    if (typeof onClick === "function") {
        return (
            <div className={cn({ tag: true, focused: focus })} style={getColor(title)}>
                <button type="button" onClick={onClick} className={cn("title", "clickable")} data-tid={dataTid}>
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
            <div
                className={cn({ tag: true, removeable: true, focused: focus })}
                style={getColor(title)}
            >
                <div className={cn("title")}>{title}</div>
                <button type="button" className={cn("remove")} onClick={handleRemove}>
                    <DeleteIcon />
                </button>
            </div>
        );
    }

    return (
        <div
            className={cn({ tag: true, removeable: onRemove, focused: focus })}
            style={getColor(title)}
        >
            <div className={cn("title")}>{title}</div>
        </div>
    );
}
