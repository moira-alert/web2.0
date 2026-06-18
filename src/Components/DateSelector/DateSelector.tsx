import type { FC } from "react";
import { Calendar } from "@skbkontur/react-ui/components/Calendar";
import { dateStringToUnixTimestamp, formatDateToCalendarDate } from "../../helpers/DateUtil";
import { getMonth, getYear } from "date-fns";

interface IDateSelectorProps {
    date?: Date | number;
    setDate: (date: Date) => void;
    minDate?: Date;
    maxDate?: Date;
}

type Month = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

export const DateSelector: FC<IDateSelectorProps> = ({ date, setDate, minDate, maxDate }) => {
    return (
        <Calendar
            style={{ borderRadius: 0, borderTopRightRadius: "8px" }}
            value={date ? formatDateToCalendarDate(date) : null}
            initialMonth={(getMonth(date ?? new Date()) + 1) as Month}
            initialYear={getYear(date ?? new Date())}
            minDate={minDate && formatDateToCalendarDate(minDate)}
            maxDate={maxDate && formatDateToCalendarDate(maxDate)}
            onValueChange={(value) => setDate(dateStringToUnixTimestamp(value))}
        />
    );
};
