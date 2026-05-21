import type { ReactElement } from "react";
import { ReactNode } from "react";
import { IconQuestionCircleRegular16 } from "@skbkontur/icons/IconQuestionCircleRegular16";
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
}: HelpTooltipProps): ReactElement {
    return (
        <Tooltip pos={pos} render={() => children} trigger={trigger} closeButton={closeButton}>
            <span className={cn.icon}>
                <IconQuestionCircleRegular16 />
            </span>
        </Tooltip>
    );
}
