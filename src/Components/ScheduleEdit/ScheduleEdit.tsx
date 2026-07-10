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

const toRawTime = (offset: number): string => {
    const hours = Math.floor(offset / 60) % 24;
    const minutes = offset % 60;
    return `${String(hours).padStart(2, "0")}${String(minutes).padStart(2, "0")}`;
};

const fromRawTime = (raw: string): number => {
    const digits = raw.replace(/\D/g, "");
    const hours = parseInt(digits.slice(0, 2), 10) || 0;
    const minutes = parseInt(digits.slice(2, 4), 10) || 0;
    return Math.min(hours, 23) * 60 + Math.min(minutes, 59);
};

const ScheduleEdit: FC<IProps> = forwardRef<HTMLDivElement, IProps>(function ScheduleEdit(
    { schedule, error, onChange, onBlur },
    validationRef
) {
    const defaultSched = useMemo(() => defaultSchedule(schedule), [schedule]);
    const [allDay, setAllDay] = useState(
        defaultSched.startOffset === 0 && defaultSched.endOffset === 1439
    );

    const [startRaw, setStartRaw] = useState(() => toRawTime(defaultSched.startOffset));
    const [endRaw, setEndRaw] = useState(() => toRawTime(defaultSched.endOffset));

    useEffect(() => {
        setStartRaw(toRawTime(defaultSched.startOffset));
        setEndRaw(toRawTime(defaultSched.endOffset));
    }, [defaultSched.startOffset, defaultSched.endOffset]);

    const handleStartChange = (value: string) => {
        setStartRaw(value);
        if (value.replace(/\D/g, "").length === 4) {
            onChange({
                ...defaultSched,
                startOffset: fromRawTime(value),
            });
        }
    };

    const handleEndChange = (value: string) => {
        setEndRaw(value);
        if (value.replace(/\D/g, "").length === 4) {
            onChange({
                ...defaultSched,
                endOffset: fromRawTime(value),
            });
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        onChange({
            ...defaultSched,
            startOffset: fromRawTime(startRaw),
            endOffset: fromRawTime(endRaw),
        });
        onBlur?.(e);
    };

    return (
        <div onBlur={handleBlur} ref={validationRef}>
            <div className={cn("days")}>
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
                    <MaskedInput
                        value={startRaw}
                        width={60}
                        mask="99:99"
                        disabled={allDay}
                        onValueChange={handleStartChange}
                    />
                    <span>—</span>
                    <MaskedInput
                        value={endRaw}
                        width={60}
                        mask="99:99"
                        disabled={allDay}
                        onValueChange={handleEndChange}
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
        </div>
    );
});

export default ScheduleEdit;
