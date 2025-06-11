import React, { ReactElement, ReactNode } from "react";
import cn from "./Hovered.module.less";

interface HoveredProps {
    children: ReactNode;
}

export function Hovered(props: HoveredProps): ReactElement {
    return <span className={cn.container}>{props.children}</span>;
}

export function HoveredShow(props: HoveredProps): ReactElement {
    return <span className={cn.child}>{props.children}</span>;
}
