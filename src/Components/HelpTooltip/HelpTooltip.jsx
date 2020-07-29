// @flow
import React, { ReactNode } from "react";
import HelpDotIcon from "@skbkontur/react-icons/HelpDot";
import { Tooltip } from "@skbkontur/react-ui/components/Tooltip";
import cn from "./HelpTooltip.less";

type HelpTooltipProps = {
    children: ReactNode,
    pos: string | undefined,
    closeButton: boolean | undefined,
};

export default function HelpTooltip({
    children,
    pos = "right top",
    closeButton,
}: HelpTooltipProps) {
    return (
        <Tooltip pos={pos} render={() => children} trigger="click" closeButton={closeButton}>
            <span className={cn.icon}>
                <HelpDotIcon />
            </span>
        </Tooltip>
    );
}
