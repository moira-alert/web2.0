import React, { useState, useEffect, FC } from "react";
import { TimeSelector } from "../TimeSelector/TimeSelector";
import { format, isAfter, isBefore } from "date-fns";
import { DateSelector } from "../DateSelector/DateSelector";
import { timeList } from "../../helpers/DateUtil";
import classNames from "classnames/bind";

import styles from "./DateAndTimeSelector.less";

const cn = classNames.bind(styles);

interface IDateAndTimeSelectorProps {
    date?: Date;
    minDate: Date;
    maxDate: Date;
    setDate: (date: Date) => void;
}

export const DateAndTimeSelector: FC<IDateAndTimeSelectorProps> = ({
    date,
    minDate,
    maxDate,
    setDate,
}) => {
    const initialDate = date ?? minDate;
    const [time, setTime] = useState(format(initialDate, "HH:mm:ss"));
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(initialDate);
    const timeZone = format(initialDate, "OOOO");

    const handleDatePick = (dateValue: Date) => {
        setSelectedDate(dateValue);
    };

    const handleSetTime = (time: string) => {
        setTime(time + ":00");
    };

    const isTimeDisabled = (preparedTime: string): boolean => {
        if (!selectedDate) return true;
        const [hours, minutes] = preparedTime.split(":").map(Number);
        const selectedDateTime = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            hours,
            minutes
        );

        return isBefore(selectedDateTime, minDate) || isAfter(selectedDateTime, maxDate);
    };

    useEffect(() => {
        if (!time || !selectedDate) {
            return;
        }
        const [hours, minutes, seconds] = time.split(":").map(Number);
        const changedMaintenance = new Date(
            selectedDate.getFullYear(),
            selectedDate.getMonth(),
            selectedDate.getDate(),
            hours,
            minutes,
            seconds
        );
        setDate(changedMaintenance);
    }, [selectedDate, time]);

    return (
        <div className={cn("menu-container")}>
            <TimeSelector
                isTimeDisabled={isTimeDisabled}
                setTime={handleSetTime}
                selectedTime={time}
                times={timeList}
            />
            <DateSelector
                date={date}
                maxDate={maxDate}
                minDate={minDate}
                setDate={handleDatePick}
            />
            <footer className={cn("footer")}>{timeZone}</footer>
        </div>
    );
};
