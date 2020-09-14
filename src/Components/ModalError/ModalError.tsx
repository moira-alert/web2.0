import React from "react";
import ErrorIcon from "@skbkontur/react-icons/Error";
import cn from "./ModalError.less";

type FooterErrorProps = {
    message?: string;
    maxWidth?: string;
};

export default function ModalError({
    message,
    maxWidth,
}: FooterErrorProps): React.ReactElement | null {
    return message ? (
        <div className={cn.root}>
            <div style={{ maxWidth }}>
                <ErrorIcon /> {message}
            </div>
        </div>
    ) : null;
}
