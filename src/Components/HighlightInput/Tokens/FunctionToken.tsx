import React from "react";
import cn from "./Tokens.less";

type FunctionTokenProps = {
    children: React.ReactNode;
};

export default function FunctionToken({ children }: FunctionTokenProps): React.ReactElement {
    return <span className={cn("function")}>{children}</span>;
}
