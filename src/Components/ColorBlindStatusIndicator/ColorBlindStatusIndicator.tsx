import { type ReactElement } from "react";
import { Status, getColorBlindStatusColor } from "../../Domain/Status";
import { Tooltip } from "@skbkontur/react-ui/components/Tooltip";
import classNames from "classnames/bind";
import { COLORBLIND_ICONS } from "./Components/ColorBlindIcons";
import styles from "./ColorBlindStatusIndicator.module.less";

const cn = classNames.bind(styles);

type Props = {
    statuses: Status[];
    size?: number;
    disabled?: boolean;
};

export const ColorBlindStatusIndicator = ({
    statuses,
    size = 23,
    disabled = false,
}: Props): ReactElement => {
    const isSingle = statuses.length === 1;

    return (
        <span
            className={cn("container", {
                single: isSingle,
                disabled,
            })}
        >
            {statuses.map((status, i) => {
                const color = getColorBlindStatusColor(status);
                const iconElement = COLORBLIND_ICONS[status](size, color);

                return (
                    <Tooltip key={i} render={() => status}>
                        {iconElement}
                    </Tooltip>
                );
            })}
        </span>
    );
};
