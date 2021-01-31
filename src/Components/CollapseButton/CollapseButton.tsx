import React, { ReactElement, ReactNode, useState } from "react";
import { Button } from "@skbkontur/react-ui";
import AnimateHeight from "react-animate-height";
import ArrowChevronRightIcon from "@skbkontur/react-icons/ArrowChevronRight";
import ArrowChevronDownIcon from "@skbkontur/react-icons/ArrowChevronDown";

interface CollapseButtonProps {
    title: string;
    children: ReactNode;
}

export function CollapseButton(props: CollapseButtonProps): ReactElement {
    const [collapsed, setCollapsed] = useState(true);

    return (
        <div>
            <Button
                use={"link"}
                onClick={() => setCollapsed(!collapsed)}
                icon={collapsed ? <ArrowChevronRightIcon /> : <ArrowChevronDownIcon />}
            >
                {props.title}
            </Button>
            <AnimateHeight height={collapsed ? 0 : "auto"}>{props.children}</AnimateHeight>
        </div>
    );
}
