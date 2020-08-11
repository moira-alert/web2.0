// @flow
import React from "react";
import cn from "./Tokens.less";

type FunctionTokenProps = {
    children: ReactNode,
};

export default function FunctionToken({ children }: FunctionTokenProps) {
    return <span className={cn("function")}>{children}</span>;
}
