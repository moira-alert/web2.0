// @flow
import * as React from "react";
import { Link } from "react-router-dom";
import cn from "./RouterLink.less";

export type RouterLinkWithIconProps = {
    icon?: React.Element,
    children?: any,
    className?: string,
};

export default function RouterLink({ icon, children, className, ...props }: RouterLinkWithIconProps): React.Node {
    return (
        <Link className={cn(className, "link")} {...props}>
            {icon}
            {icon ? " " : ""}
            <span className={cn("content")}>{children}</span>
        </Link>
    );
}
