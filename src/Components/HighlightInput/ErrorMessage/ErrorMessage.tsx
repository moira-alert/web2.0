import React from "react";
import classNames from "classnames/bind";

import styles from "./ErrorMessage.module.less";

const cn = classNames.bind(styles);

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
            data-tid="Error Message"
        >
            {error || warning}
        </div>
    );
}
