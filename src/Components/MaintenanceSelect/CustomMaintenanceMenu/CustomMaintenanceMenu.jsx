// @flow
import React, { useState, useRef } from "react";
import { Input } from "@skbkontur/react-ui/components/Input/Input";
import { Button } from "@skbkontur/react-ui/components/Button/Button";
import { Calendar, CalendarDateShape } from "@skbkontur/react-ui/internal/Calendar";
import { DateInput } from "@skbkontur/react-ui/components/DateInput/DateInput";
import { MenuItem } from "@skbkontur/react-ui/components/MenuItem";
import { Menu } from "@skbkontur/react-ui/internal/Menu";
import { addMonths, format, getUnixTime, fromUnixTime, lastDayOfMonth, addDays } from "date-fns";
import { tooltip, ValidationContainer, ValidationWrapperV1 } from "@skbkontur/react-ui-validations";
import cn from "./CustomMaintenanceMenu.less";

function splitDate(date: Date): [string, CalendarDateShape, string] {
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
function toDate(date: CalendarDateShape): Date {
    return new Date(date.year, date.month, date.date);
}

function toStringDate(calendarDate: CalendarDateShape): string {
    return format(toDate(calendarDate), "dd.MM.yyyy");
}

function toCalendarDate(date: string): CalendarDateShape {
    const [day, month, year] = date.split(".").map(Number);
    return {
        year,
        month: month - 1,
        date: day,
    };
}

export function getLastDayOfNextMonth(): CalendarDateShape {
    const date = lastDayOfMonth(addMonths(new Date(), 1));

    return {
        year: date.getFullYear(),
        month: date.getMonth(),
        date: date.getDate(),
    };
}

const PreparedTimes = Array(24)
    .fill()
    .map((_, index) => `${index}:00`.padStart(5, "0"));

type CustomMaintenanceMenuProps = {
    maintenance: number | undefined,
    setMaintenance: (maintenance: number) => void,
};

export default function CustomMaintenanceMenu({
    maintenance,
    setMaintenance,
}: CustomMaintenanceMenuProps) {
    const [maintenanceTime, maintenanceDate] = maintenance
        ? splitDate(fromUnixTime(maintenance))
        : [];
    const [todayTime, todayDate, timeZone] = splitDate(new Date());
    const maxDate = getLastDayOfNextMonth();

    const [calendarDate, setCalendarDate] = useState(maintenanceDate || todayDate);
    const [stringDate, setStringDate] = useState(toStringDate(maintenanceDate || todayDate));
    const [time, setTime] = useState(maintenanceTime || todayTime);

    const validationContainerEl = useRef(null);
    const validate = async () => {
        if (validationContainerEl.current == null) {
            return false;
        }
        return validationContainerEl.current.validate();
    };
    const validateDate = () => {
        const date = getUnixTime(toDate(calendarDate));
        if (getUnixTime(addDays(toDate(maxDate), 1)) <= date) {
            return {
                message: `The maximum date is ${toStringDate(maxDate)} now`,
                type: "submit",
            };
        }
        if (getUnixTime(toDate(todayDate)) > date) {
            return {
                message: `Maintenance date must be in the future`,
                type: "submit",
            };
        }
        return null;
    };

    const handleDatePick = (dateValue: CalendarDateShape) => {
        setCalendarDate(dateValue);
        setStringDate(toStringDate(dateValue));
    };

    const handleInputDateChange = (dateValue: string) => {
        setCalendarDate(toCalendarDate(dateValue));
        setStringDate(dateValue);
    };

    const handleSet = async () => {
        if (await validate()) {
            const [hours, minutes] = time.split(":").map(Number);
            const changedMaintenance = new Date(
                calendarDate.year,
                calendarDate.month,
                calendarDate.date,
                hours,
                minutes
            );
            setMaintenance(getUnixTime(changedMaintenance));
        }
    };

    return (
        <div className={cn("container")}>
            <Menu hasShadow={false} maxHeight="100%">
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
                minDate={todayDate}
                maxDate={maxDate}
                onSelect={handleDatePick}
            />
            <footer className={cn("footer")}>
                <Input value={time} onValueChange={setTime} mask="99:99" width="60px" />
                <ValidationContainer ref={validationContainerEl}>
                    <ValidationWrapperV1
                        renderMessage={tooltip("top left")}
                        validationInfo={validateDate()}
                    >
                        <DateInput
                            value={stringDate}
                            maxDate={maxDate}
                            minDate={todayDate}
                            onValueChange={handleInputDateChange}
                            width="90px"
                        />
                    </ValidationWrapperV1>
                </ValidationContainer>
                {timeZone}
                <Button use="primary" onClick={handleSet}>
                    Set
                </Button>
            </footer>
        </div>
    );
}
