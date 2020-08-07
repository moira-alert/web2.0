// @flow
import React, { useState } from "react";
import { Input } from "@skbkontur/react-ui/components/Input/Input";
import { Button } from "@skbkontur/react-ui/components/Button/Button";
import { Calendar, CalendarDateShape } from "@skbkontur/react-ui/internal/Calendar";
import { DateInput } from "@skbkontur/react-ui/components/DateInput/DateInput";
import { LocaleContext } from "@skbkontur/react-ui/lib/locale/LocaleContext";
import { LangCodes, DateOrder } from "@skbkontur/react-ui/lib/locale";
import { ThemeContext } from "@skbkontur/react-ui/lib/theming/ThemeContext";
import { ThemeFactory } from "@skbkontur/react-ui/lib/theming/ThemeFactory";
import { MenuItem } from "@skbkontur/react-ui/components/MenuItem";
import { Menu } from "@skbkontur/react-ui/internal/Menu";
import { addMonths, format, lastDayOfMonth } from "date-fns";
import cn from "./CustomMaintenanceMenu.less";

function getTodayDate(): [string, CalendarDateShape, string] {
    const date = new Date();
    return [
        format(date, "HH:mm"),
        {
            year: date.getFullYear(),
            month: date.getMonth(),
            date: date.getDate(),
        },
        format(date, "OOOO"),
    ];
}

function toStringDate(date: CalendarDateShape): string {
    return format(new Date(date.year, date.month, date.date), "dd.MM.yyyy");
}

function toCalendarDate(date: string): CalendarDateShape {
    const [day, month, year] = date.split(".").map(Number);
    return {
        year,
        month: month - 1,
        date: day,
    };
}

function getLastDayOfNextMonth(): CalendarDateShape {
    const date = lastDayOfMonth(addMonths(new Date(), 1));

    return {
        year: date.getFullYear(),
        month: date.getMonth(),
        date: date.getDate(),
    };
}

type CustomMaintenanceMenuProps = {
    setMaintenance: (maintenance: number) => void,
};

const PreparedTimes = Array(24)
    .fill()
    .map((_, index) => `${index}:00`.padStart(5, "0"));

export default function CustomMaintenanceMenu({ setMaintenance }: CustomMaintenanceMenuProps) {
    const [currentTime, currentDate, timeZone] = getTodayDate();
    const maxDate = getLastDayOfNextMonth();
    const [calendarDate, setCalendarDate] = useState(currentDate);
    const [stringDate, setStringDate] = useState(toStringDate(currentDate));
    const [time, setTime] = useState(currentTime);

    const handleSet = () => {
        const [hours, minutes] = time.split(":").map(Number);
        const maintenance = new Date(
            calendarDate.year,
            calendarDate.month,
            calendarDate.date,
            hours,
            minutes
        );

        setMaintenance(maintenance);
    };

    const handleDatePick = (dateValue: CalendarDateShape) => {
        setCalendarDate(dateValue);
        setStringDate(toStringDate(dateValue));
    };
    const handleInputDateChange = (dateValue: string) => {
        setCalendarDate(toCalendarDate(dateValue));
        setStringDate(dateValue);
    };

    return (
        <LocaleContext.Provider
            value={{
                langCode: LangCodes.en_GB,
                locale: {
                    DatePicker: {
                        separator: ".",
                        order: DateOrder.DMY,
                    },
                },
            }}
        >
            <ThemeContext.Provider
                value={ThemeFactory.create({ menuBorder: "none", menuShadow: "none" })}
            >
                <div className={cn("container")}>
                    <Menu maxHeight="100%">
                        {PreparedTimes.map(preparedTime => (
                            <MenuItem
                                key={preparedTime}
                                state={preparedTime === time ? "selected" : null}
                                onClick={() => setTime(preparedTime)}
                            >
                                <div className={cn("menu-item")}>{preparedTime}</div>
                            </MenuItem>
                        ))}
                    </Menu>
                    <Calendar
                        value={calendarDate}
                        minDate={currentDate}
                        maxDate={maxDate}
                        onSelect={handleDatePick}
                    />
                    <footer className={cn("footer")}>
                        <Input value={time} onValueChange={setTime} mask="99:99" width="60px" />
                        <DateInput
                            value={stringDate}
                            maxDate={maxDate}
                            minDate={currentDate}
                            onValueChange={handleInputDateChange}
                            width="90px"
                        />
                        {timeZone}
                        <Button use="primary" onClick={handleSet}>
                            Set
                        </Button>
                    </footer>
                </div>
            </ThemeContext.Provider>
        </LocaleContext.Provider>
    );
}
