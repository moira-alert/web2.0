import React from "react";
import ErrorIcon from "@skbkontur/react-icons/Error";
import classNames from "classnames/bind";

import styles from "./ModalError.less";

const cn = classNames.bind(styles);

type FooterErrorProps = {
    message?: string | null;
    maxWidth?: string;
};

export default function ModalError({
    message,
    maxWidth,
}: FooterErrorProps): React.ReactElement | null {
    return message ? (
        <div className={cn("root")}>
            <div style={{ maxWidth }}>
                <ErrorIcon /> {message}
            </div>
        </div>
    ) : null;
}
