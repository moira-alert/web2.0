import React, { ReactNode } from "react";
import HelpDotIcon from "@skbkontur/react-icons/HelpDot";
import { Tooltip } from "@skbkontur/react-ui/components/Tooltip";
import { PopupPosition } from "@skbkontur/react-ui/internal/Popup";
import cn from "./HelpTooltip.less";

type HelpTooltipProps = {
    children: ReactNode;
    pos?: PopupPosition;
    closeButton?: boolean;
};

export default function HelpTooltip({
    children,
    pos = "right top",
    closeButton,
}: HelpTooltipProps): React.ReactElement {
    return (
        <Tooltip pos={pos} render={() => children} trigger="click" closeButton={closeButton}>
            <span className={cn.icon}>
                <HelpDotIcon />
            </span>
        </Tooltip>
    );
}
