import React, { useState, useRef } from "react";
import { Input } from "@skbkontur/react-ui/components/Input/Input";
import { Button } from "@skbkontur/react-ui/components/Button/Button";
import { Calendar, CalendarDateShape } from "@skbkontur/react-ui/components/Calendar";
import { DateInput } from "@skbkontur/react-ui/components/DateInput/DateInput";
import { MenuItem } from "@skbkontur/react-ui/components/MenuItem";
import { Menu } from "@skbkontur/react-ui/internal/Menu";
import { addMonths, format, getUnixTime, fromUnixTime, lastDayOfMonth, addDays } from "date-fns";
import { tooltip, ValidationContainer, ValidationWrapperV1 } from "@skbkontur/react-ui-validations";
import { ValidationInfo } from "@skbkontur/react-ui-validations/src/ValidationWrapper";
import { Nullable } from "@skbkontur/react-ui-validations/typings/Types";
import classNames from "classnames/bind";

import styles from "./CustomMaintenanceMenu.less";

const cn = classNames.bind(styles);

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
    return format(toDate(calendarDate), "dd/MM/yyyy");
}

function toCalendarDate(date: string): CalendarDateShape {
    // DateInput's onValueChange return value with "." separator regardless of locale
    const [day, month, year] = date.split(".").map(Number);
    return {
        year,
        month: month - 1,
        date: day,
    };
}

export function getLastDayOfNextMonth(currentTime: Date): CalendarDateShape {
    const date = lastDayOfMonth(addMonths(currentTime, 1));

    return {
        year: date.getFullYear(),
        month: date.getMonth(),
        date: date.getDate(),
    };
}

const PreparedTimes = Array(24)
    .fill(undefined)
    .map((_, index) => `${index}:00`.padStart(5, "0"));

type CustomMaintenanceMenuProps = {
    currentTime?: Date;
    maintenance?: number;
    setMaintenance: (maintenance: number) => void;
};

export default function CustomMaintenanceMenu({
    maintenance,
    setMaintenance,
    currentTime = new Date(),
}: CustomMaintenanceMenuProps): React.ReactElement {
    const [maintenanceTime, maintenanceDate] = maintenance
        ? splitDate(fromUnixTime(maintenance))
        : [];
    const [todayTime, todayDate, timeZone] = splitDate(currentTime);
    const maxDate = getLastDayOfNextMonth(currentTime);

    const [calendarDate, setCalendarDate] = useState(maintenanceDate || todayDate);
    const [stringDate, setStringDate] = useState(
        toStringDate(
            maintenanceDate && maintenance && fromUnixTime(maintenance) > currentTime
                ? maintenanceDate
                : todayDate
        )
    );
    const [time, setTime] = useState(
        maintenanceTime && maintenance && fromUnixTime(maintenance) > currentTime
            ? maintenanceTime
            : todayTime
    );

    const validationContainerEl = useRef<ValidationContainer>(null);
    const validate = async () => {
        return validationContainerEl.current?.validate();
    };
    const validateDate = (): Nullable<ValidationInfo> => {
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
            <Menu hasShadow={false}>
                {PreparedTimes.map((preparedTime) => (
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
                value={toStringDate(calendarDate)}
                initialMonth={calendarDate.month}
                initialYear={calendarDate.year}
                minDate={toStringDate(todayDate)}
                maxDate={toStringDate(maxDate)}
                onValueChange={(value) => handleDatePick(toCalendarDate(value))}
            />
            <footer className={cn("footer")}>
                <Input value={time} onValueChange={setTime} mask="99:99" width="55px" />
                <ValidationContainer ref={validationContainerEl}>
                    <ValidationWrapperV1
                        renderMessage={tooltip("top left")}
                        validationInfo={validateDate()}
                    >
                        <DateInput
                            value={stringDate}
                            maxDate={toStringDate(maxDate)}
                            minDate={toStringDate(todayDate)}
                            onValueChange={handleInputDateChange}
                            width="95px"
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
