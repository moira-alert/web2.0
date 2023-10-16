import React from "react";
import classNames from "classnames/bind";

import styles from "./HighlightInput.less";

const cn = classNames.bind(styles);

interface ValidatedDivControlProps<HTMLDivElement> {
    ref?: React.Ref<HTMLDivElement>;
    error?: boolean;
    warning?: boolean;
    onBlur?: React.FocusEventHandler<HTMLDivElement>;
    onChange?: React.ChangeEventHandler<HTMLDivElement>;
}
interface ValidatedDivProps
    extends ValidatedDivControlProps<HTMLDivElement>,
        React.InputHTMLAttributes<HTMLDivElement> {
    onValueChange?: unknown;
}

export const ValidatedDiv = React.forwardRef<HTMLDivElement, ValidatedDivProps>(
    function DivWithValidation({ error, warning, onValueChange, ...props }, ref) {
        return (
            <div
                className={cn({
                    warning: warning,
                    error: error,
                })}
                ref={ref}
                {...props}
            />
        );
    }
);
