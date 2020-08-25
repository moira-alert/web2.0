import * as React from "react";
import cn from "./CodeRef.less";

export default function CodeRef({ children }: { children: React.ReactNode }): React.ReactNode {
    return <span className={cn("code-ref")}>{children}</span>;
}
