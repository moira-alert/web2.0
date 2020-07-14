// @flow
import React from "react";
import cn from "./ErrorMessage.less";

type ErrorMessageProps = {
    error?: string,
    warning?: string,
};

export default function ErrorMessage({ error, warning }: ErrorMessageProps) {
    if (error) {
        return <span className={cn("error")}>{error}</span>;
    }

    if (warning) {
        return <span className={cn("warning")}>{warning}</span>;
    }

    return null;
}
