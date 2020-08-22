// @flow
import React from "react";
import cn from "./Tokens.less";

type ErrorTokenProps = {
    children: ReactNode,
};

export default function ErrorToken({ children }: ErrorTokenProps) {
    return <span className={cn("error")}>{children}</span>;
}
