import React from "react";
import { Tooltip } from "@skbkontur/react-ui";
import { TokenType } from "../../helpers/TokenType";
import { useTheme } from "../../Themes";

import classNames from "classnames/bind";

import styles from "./Token.less";

const cn = classNames.bind(styles);

type Props = {
    children: string;
    type?: TokenType;
    onClick?: (token: string) => void;
    onRemove?: (token: string) => void;
};

export const Token = (props: Props): React.ReactElement => {
    const { children, type, onRemove, onClick } = props;
    const theme = useTheme();

    if (type === TokenType.REMOVABLE || type === TokenType.NONEXISTENT) {
        const handleRemove = () => {
            onRemove?.(children);
        };

        return (
            <Tooltip
                render={() => (type === TokenType.NONEXISTENT ? "This tag doesn't exist" : null)}
                trigger="hover"
                pos="bottom center"
            >
                <span
                    style={{
                        color: type !== TokenType.NONEXISTENT ? theme.textColorDefault : "",
                    }}
                    className={cn("token", "removable", {
                        nonexistent: type === TokenType.NONEXISTENT,
                    })}
                >
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

    if (type === TokenType.SELECTABLE) {
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
