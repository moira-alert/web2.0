import React, { useState } from "react";
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
    const [anchor, setAnchor] = useState<HTMLElement | null>(null);

    if (type === "removable" || type === "nonexistent") {
        const handleRemove = () => {
            onRemove?.(children);
        };

        return (
            <span
                className={cn("token", "removable", { nonexistent: type === "nonexistent" })}
                onMouseEnter={({ target }) => setAnchor(target as HTMLElement)}
                onMouseLeave={() => setAnchor(null)}
            >
                {children}
                <button
                    type="button"
                    className={cn("token-remove")}
                    onClick={handleRemove}
                    aria-label="Remove"
                />
                {type === "nonexistent" && anchor && (
                    <Tooltip
                        anchorElement={anchor}
                        render={() => "This tag doesn't exist"}
                        trigger="hover"
                        pos="bottom center"
                    />
                )}
            </span>
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
