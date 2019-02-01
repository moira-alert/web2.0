// @flow
import * as React from "react";
import cn from "./CodeRef.less";

export default function CodeRef({ children }: { children: React.Node }): React.Node {
    return <span className={cn("code-ref")}>{children}</span>;
}
