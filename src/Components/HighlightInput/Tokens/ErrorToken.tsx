import React from "react";
import cn from "./Tokens.less";

type ErrorTokenProps = {
    children: React.ReactNode;
};

export default function ErrorToken({ children }: ErrorTokenProps): React.ReactElement {
    return <span className={cn("error")}>{children}</span>;
}
