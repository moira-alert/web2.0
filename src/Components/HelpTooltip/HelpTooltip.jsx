// @flow
import React, { ReactNode } from "react";
import HelpDotIcon from "@skbkontur/react-icons/HelpDot";
import { Tooltip } from "@skbkontur/react-ui/components/Tooltip";
import cn from "./HelpTooltip.less";

type HelpTooltipProps = {
    children: ReactNode,
    pos: string | undefined,
};

export default function HelpTooltip({ children, pos = "bottom left" }: HelpTooltipProps) {
    return (
        <Tooltip pos={pos} render={() => children} trigger="click">
            <span className={cn.icon}>
                <HelpDotIcon color="#3072c4" />
            </span>
        </Tooltip>
    );
}
