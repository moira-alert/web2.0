// @flow
import * as React from "react";
import cn from "./Token.less";

type Props = {|
    children: string,
    type?: "removable" | "selectable",
    onClick?: string => void,
    onRemove?: string => void,
|};

const Token = (props: Props) => {
    const { children, type, onRemove, onClick } = props;

    if (type === "removable") {
        const handleRemove = () => {
            if (onRemove) {
                onRemove(children);
            }
        };

        return (
            <span className={cn("token", "removable")}>
                {children}
                <button
                    type="button"
                    className={cn("token-remove")}
                    onClick={handleRemove}
                    aria-label="Remove"
                />
            </span>
        );
    }

    if (type === "selectable") {
        const handleClick = () => {
            if (onClick) {
                onClick(children);
            }
        };

        return (
            <button type="button" className={cn("token", "selectable")} onClick={handleClick}>
                {children}
            </button>
        );
    }

    return <span className={cn("token")}>{children}</span>;
};

export { Token as default };
