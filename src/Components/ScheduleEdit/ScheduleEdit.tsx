import type { FocusEventHandler } from "react";
import { forwardRef, useState, useMemo, useEffect, FC } from "react";
import { MaskedInput } from "@skbkontur/react-ui";
import { Radio } from "@skbkontur/react-ui/components/Radio";
import { Checkbox } from "@skbkontur/react-ui/components/Checkbox";
import HelpTooltip from "../HelpTooltip/HelpTooltip";
import classNames from "classnames/bind";
import { Schedule, defaultSchedule } from "../../Domain/Schedule";

import styles from "./ScheduleEdit.module.less";

const cn = classNames.bind(styles);

interface IProps {
    schedule?: Schedule;
    error?: boolean;
    onBlur?: FocusEventHandler<HTMLDivElement>;
    onChange: (schedule: Schedule) => void;
}

const ScheduleEdit: FC<IProps> = forwardRef<HTMLDivElement, IProps>(function ScheduleEdit(
    { schedule, error, onChange, onBlur },
    validationRef
) {
    const defaultSched = useMemo(() => defaultSchedule(schedule), [schedule]);
    const [allDay, setAllDay] = useState(
        defaultSched.startOffset === 0 && defaultSched.endOffset === 1439
    );

    const [startInput, setStartInput] = useState(formatTime(defaultSched.startOffset));
    const [endInput, setEndInput] = useState(formatTime(defaultSched.endOffset));

    useEffect(() => {
        setStartInput(formatTime(defaultSched.startOffset));
    }, [defaultSched.startOffset]);

    useEffect(() => {
        setEndInput(formatTime(defaultSched.endOffset));
    }, [defaultSched.endOffset]);

    const handleDayChange = (index: number, checked: boolean) => {
        onChange({
            ...defaultSched,
            days: [
                ...defaultSched.days.slice(0, index),
                { name: defaultSched.days[index].name, enabled: checked },
                ...defaultSched.days.slice(index + 1),
            ],
        });
    };

    const handleAllDayChange = () => {
        onChange({
            ...defaultSched,
            startOffset: 0,
            endOffset: 1439,
        });
        setAllDay(true);
    };

    const handleSpecificIntervalChange = () => {
        setAllDay(false);
    };

    const handleTimeChange = (type: "start" | "end", value: string) => {
        const setter = type === "start" ? setStartInput : setEndInput;
        const offsetKey = type === "start" ? "startOffset" : "endOffset";

        setter(value);

        if (/^\d{2}:\d{2}$/.test(value)) {
            onChange({
                ...defaultSched,
                [offsetKey]: parseTime(value),
            });
        }
    };

    return (
        <>
            <div onFocus={onBlur} ref={validationRef} className={cn("days")}>
                {defaultSched.days.map(({ name, enabled }, i) => (
                    <Checkbox
                        error={error}
                        key={name}
                        checked={enabled}
                        onValueChange={(checked) => handleDayChange(i, checked)}
                    >
                        {name}
                    </Checkbox>
                ))}
            </div>

            <div className={cn("group")}>
                <span className={cn("radio")}>
                    <Radio checked={allDay} onValueChange={handleAllDayChange} value="all_day">
                        All day
                    </Radio>
                </span>
                <span className={cn("radio")}>
                    <Radio
                        checked={!allDay}
                        value="specific_interval"
                        onValueChange={handleSpecificIntervalChange}
                    >
                        At specific interval
                    </Radio>
                    <MaskedInput
                        value={startInput}
                        width={60}
                        mask="99:99"
                        disabled={allDay}
                        onValueChange={(value) => handleTimeChange("start", value)}
                    />
                    <span>—</span>
                    <MaskedInput
                        value={endInput}
                        width={60}
                        mask="99:99"
                        disabled={allDay}
                        onValueChange={(value) => handleTimeChange("end", value)}
                    />
                    <HelpTooltip>
                        <div className={cn("time-range-description-title")}>
                            Either negative and positive intervals are allowed.
                        </div>
                        <div>
                            For example: 23:00 - 06:00 specifies interval between 23:00 <br />
                            of the current day to the 06:00 of the next day.
                        </div>
                    </HelpTooltip>
                </span>
            </div>
        </>
    );
});

const formatTime = (time: number): string => {
    const HOUR_IN_DAY = 24;
    const MIN_IN_HOUR = 60;
    const hours = Math.floor(time / MIN_IN_HOUR) < HOUR_IN_DAY ? Math.floor(time / MIN_IN_HOUR) : 0;
    const minutes = time % MIN_IN_HOUR < MIN_IN_HOUR ? time % MIN_IN_HOUR : 0;
    return `${hours > 9 ? hours : `0${hours}`}:${minutes > 9 ? minutes : `0${minutes}`}`;
};

const parseTime = (time: string): number => {
    const HOUR_IN_DAY = 24;
    const MIN_IN_HOUR = 60;
    const [hours, minutes] = time.split(":");
    const parsedHours = parseInt(hours, 10) < HOUR_IN_DAY ? parseInt(hours, 10) : 0;
    const parsedMinutes = parseInt(minutes, 10) < MIN_IN_HOUR ? parseInt(minutes, 10) : 0;
    return parsedHours * MIN_IN_HOUR + parsedMinutes;
};

export default ScheduleEdit;
