import React, { ReactElement, ReactNode, useState } from "react";
import { Button, Spinner } from "@skbkontur/react-ui";
import AnimateHeight from "react-animate-height";
import ArrowChevronRightIcon from "@skbkontur/react-icons/ArrowChevronRight";
import ArrowChevronDownIcon from "@skbkontur/react-icons/ArrowChevronDown";

interface CollapseButtonProps {
    title: string;
    loading?: boolean;
    onCollapse?: (collapsed: boolean) => void;
    children: ReactNode;
}

export function CollapseButton(props: CollapseButtonProps): ReactElement {
    const [collapsed, setCollapsed] = useState(true);

    const handleCollapse = () => {
        setCollapsed(!collapsed);
        props.onCollapse?.(!collapsed);
    };

    return (
        <div>
            <Button
                use={"link"}
                onClick={handleCollapse}
                icon={collapsed ? <ArrowChevronRightIcon /> : <ArrowChevronDownIcon />}
            >
                {props.title}
            </Button>
            {props.loading === true ? (
                <div>
                    <Spinner dimmed type={"mini"} />
                </div>
            ) : null}
            <AnimateHeight height={collapsed || props.loading ? 0 : "auto"}>
                {props.children}
            </AnimateHeight>
        </div>
    );
}
