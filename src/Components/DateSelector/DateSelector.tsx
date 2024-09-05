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

export const DateSelector: React.FC<IDateSelectorProps> = ({ date, setDate, minDate, maxDate }) => {
    return (
        <Calendar
            value={date ? formatDateToCalendarDate(date) : null}
            initialMonth={(getMonth(new Date()) + 1) as Range<1, 13>}
            initialYear={getYear(new Date())}
            minDate={minDate && formatDateToCalendarDate(minDate)}
            maxDate={maxDate && formatDateToCalendarDate(maxDate)}
            onValueChange={(value) => setDate(dateStringToUnixTimestamp(value))}
        />
    );
};
