import React from "react";
import { Calendar } from "@skbkontur/react-ui/components/Calendar";
import { dateStringToUnixTimestamp, formatDateToCalendarDate } from "../../helpers/DateUtil";
import { Range } from "@skbkontur/react-ui/typings/utility-types";
import { getMonth, getYear } from "date-fns";

interface IDateSelectorProps {
    date?: Date | number;
    setDate: (date: Date) => void;
    minDate?: Date;
    maxDate?: Date;
}

export const DateSelector: React.FC<IDateSelectorProps> = ({
    date = new Date(),
    setDate,
    minDate,
    maxDate,
}) => {
    return (
        <Calendar
            value={formatDateToCalendarDate(date)}
            initialMonth={(getMonth(date) + 1) as Range<1, 13>}
            initialYear={getYear(date)}
            minDate={minDate && formatDateToCalendarDate(minDate)}
            maxDate={maxDate && formatDateToCalendarDate(maxDate)}
            onValueChange={(value) => setDate(dateStringToUnixTimestamp(value))}
        />
    );
};
