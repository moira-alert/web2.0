import React from "react";
import cn from "./Token.less";
import { Tooltip } from "@skbkontur/react-ui";

type Props = {
    children: string;
    type?: "removable" | "selectable" | "nonexistent";
    onClick?: (token: string) => void;
    onRemove?: (token: string) => void;
};

const Token = (props: Props): React.ReactElement => {
    const { children, type, onRemove, onClick } = props;

    if (type === "removable" || type === "nonexistent") {
        const handleRemove = () => {
            onRemove?.(children);
        };

        return (
            <Tooltip
                render={() => (type === "nonexistent" ? "This tag doesn't exist" : null)}
                trigger="hover"
                pos="bottom center"
            >
                <span className={cn("token", "removable", { nonexistent: type === "nonexistent" })}>
                    {children}
                    <button
                        type="button"
                        className={cn("token-remove")}
                        onClick={handleRemove}
                        aria-label="Remove"
                    />
                </span>
            </Tooltip>
        );
    }

    if (type === "selectable") {
        const handleClick = () => {
            onClick?.(children);
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
