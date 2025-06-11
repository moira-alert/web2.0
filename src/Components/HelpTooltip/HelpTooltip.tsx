import React, { ReactNode } from "react";
import HelpDotIcon from "@skbkontur/react-icons/HelpDot";
import { Tooltip } from "@skbkontur/react-ui/components/Tooltip";
import { PopupPositionsType } from "@skbkontur/react-ui/internal/Popup";
import { TooltipTrigger } from "@skbkontur/react-ui";

import cn from "./HelpTooltip.module.less";

type HelpTooltipProps = {
    children: ReactNode;
    pos?: PopupPositionsType;
    closeButton?: boolean;
    trigger?: TooltipTrigger;
};

export default function HelpTooltip({
    children,
    pos = "right top",
    closeButton,
    trigger = "click",
}: HelpTooltipProps): React.ReactElement {
    return (
        <Tooltip pos={pos} render={() => children} trigger={trigger} closeButton={closeButton}>
            <span className={cn.icon}>
                <HelpDotIcon />
            </span>
        </Tooltip>
    );
}
