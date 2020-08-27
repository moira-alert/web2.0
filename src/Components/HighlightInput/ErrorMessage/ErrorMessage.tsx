import React from "react";
import cn from "./ErrorMessage.less";

type ErrorMessageProps = {
    error?: string;
    warning?: string;
    view: boolean;
};

export default function ErrorMessage({
    error,
    warning,
    view,
}: ErrorMessageProps): React.ReactElement {
    return (
        <div
            className={cn("container", {
                view: view && (Boolean(error) || Boolean(warning)),
                error: Boolean(error),
                warning: Boolean(warning) && !error,
            })}
        >
            {error || warning}
        </div>
    );
}
