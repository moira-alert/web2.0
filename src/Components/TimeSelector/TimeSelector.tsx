import React, { FC } from "react";
import { MenuItem } from "@skbkontur/react-ui/components/MenuItem";
import { Menu } from "@skbkontur/react-ui/internal/Menu";
import { CalendarDateShape } from "@skbkontur/react-ui/components/Calendar";
import classNames from "classnames/bind";

import styles from "./TimeSelector.less";

const cn = classNames.bind(styles);

interface ITimeSelectorProps {
    selectedTime?: string;
    times: string[];
    setTime: (time: string) => void;
    isTimeDisabled?: (time: string, date?: CalendarDateShape) => boolean;
}

export const TimeSelector: FC<ITimeSelectorProps> = ({
    selectedTime,
    times,
    setTime,
    isTimeDisabled,
}) => (
    <Menu style={{ margin: 0, borderRadius: 0, borderTopLeftRadius: "8px" }} preventWindowScroll>
        {times.map((time) => (
            <MenuItem
                key={time}
                state={time === selectedTime ? "selected" : null}
                onClick={() => setTime(time)}
                disabled={isTimeDisabled && isTimeDisabled(time)}
            >
                <div className={cn("menu-item")}>{time}</div>
            </MenuItem>
        ))}
    </Menu>
);
