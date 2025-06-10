import React, { useState, useMemo, FC } from "react";
import { Input } from "@skbkontur/react-ui/components/Input";
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
    onBlur?: React.FocusEventHandler<HTMLDivElement>;
    onChange: (schedule: Schedule) => void;
}

const ScheduleEdit: FC<IProps> = React.forwardRef<HTMLDivElement, IProps>(function ScheduleEdit(
    { schedule, error, onChange, onBlur },
    validationRef
) {
    const defaultSched = useMemo(() => defaultSchedule(schedule), [schedule]);
    const [allDay, setAllDay] = useState(
        defaultSched.startOffset === 0 && defaultSched.endOffset === 1439
    );

    const time = useMemo(() => {
        const start = formatTime(defaultSched.startOffset);
        const end = formatTime(defaultSched.endOffset);
        return { start, end };
    }, []);

    return (
        <>
            <div onFocus={onBlur} ref={validationRef} className={cn("days")}>
                {defaultSched.days.map(({ name, enabled }, i) => (
                    <Checkbox
                        error={error}
                        key={name}
                        checked={enabled}
                        onValueChange={(checked) =>
                            onChange({
                                ...defaultSched,
                                days: [
                                    ...defaultSched.days.slice(0, i),
                                    { name, enabled: checked },
                                    ...defaultSched.days.slice(i + 1),
                                ],
                            })
                        }
                    >
                        {name}
                    </Checkbox>
                ))}
            </div>

            <div className={cn("group")}>
                <span className={cn("radio")}>
                    <Radio
                        checked={allDay}
                        onValueChange={() => {
                            onChange({
                                ...defaultSched,
                                startOffset: 0,
                                endOffset: 1439,
                            });
                            setAllDay(true);
                        }}
                        value="all_day"
                    >
                        All day
                    </Radio>
                </span>
                <span className={cn("radio")}>
                    <Radio
                        checked={!allDay}
                        value="specific_interval"
                        onValueChange={() => setAllDay(false)}
                    >
                        At specific interval
                    </Radio>
                    <Input
                        value={time.start}
                        width={60}
                        mask="99:99"
                        disabled={allDay}
                        onValueChange={(value) =>
                            onChange({
                                ...defaultSched,
                                startOffset: parseTime(value),
                            })
                        }
                    />
                    <span>—</span>
                    <Input
                        value={time.end}
                        width={60}
                        mask="99:99"
                        disabled={allDay}
                        onValueChange={(value) =>
                            onChange({
                                ...defaultSched,
                                endOffset: parseTime(value),
                            })
                        }
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
