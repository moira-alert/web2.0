import React, { useState, useRef } from "react";
import { Input } from "@skbkontur/react-ui/components/Input/Input";
import { Button } from "@skbkontur/react-ui/components/Button/Button";
import { DateInput } from "@skbkontur/react-ui/components/DateInput/DateInput";
import { format, getUnixTime, fromUnixTime, parse } from "date-fns";
import { tooltip, ValidationContainer, ValidationWrapperV1 } from "@skbkontur/react-ui-validations";
import { TimeSelector } from "../../TimeSelector/TimeSelector";
import { DateSelector } from "../../DateSelector/DateSelector";
import { formatDateToCalendarDate, timeList } from "../../../helpers/DateUtil";
import { validateForm, validateMaintenanceDate } from "../../../helpers/validations";
import { useTheme } from "../../../shared/themes";
import classNames from "classnames/bind";

import styles from "./CustomMaintenanceMenu.less";

const cn = classNames.bind(styles);

interface ICustomMaintenanceMenuProps {
    maintenance?: number;
    minDate?: Date;
    maxDate?: Date;
    currentDate?: Date;
    setMaintenance: (maintenance: number) => void;
}

export default function CustomMaintenanceMenu({
    maintenance,
    minDate,
    maxDate,
    currentDate = new Date(),
    setMaintenance,
}: ICustomMaintenanceMenuProps): React.ReactElement {
    const initialDate = maintenance ? fromUnixTime(maintenance) : currentDate;
    const [time, setTime] = useState(format(initialDate, "HH:mm"));
    const timeZone = format(initialDate, "OOOO");
    const [date, setDate] = useState<Date | undefined>(initialDate);

    const theme = useTheme();

    const validationContainerRef = useRef<ValidationContainer>(null);

    const handleDatePick = (dateValue: Date) => {
        setDate(dateValue);
    };

    const handleInputDateChange = (dateValue: string) => {
        const parsedDate = parse(dateValue, "dd.MM.yyyy", new Date());
        if (!isNaN(parsedDate.getTime())) {
            setDate(parsedDate);
        }
    };

    const handleSet = async () => {
        const validationSuccess = (await validateForm(validationContainerRef)) && date;

        if (validationSuccess) {
            const [hours, minutes] = time.split(":").map(Number);
            const selectedDate = new Date(date);
            selectedDate.setHours(hours);
            selectedDate.setMinutes(minutes);
            setMaintenance(getUnixTime(selectedDate));
        }
    };

    return (
        <div className={cn("container")}>
            <TimeSelector setTime={setTime} selectedTime={time} times={timeList} />
            <DateSelector
                date={date}
                maxDate={maxDate}
                minDate={minDate}
                setDate={handleDatePick}
            />
            <footer style={{ backgroundColor: theme.appBgColorSecondary }} className={cn("footer")}>
                <Input value={time} onValueChange={setTime} mask="99:99" width="55px" />
                <ValidationContainer ref={validationContainerRef}>
                    <ValidationWrapperV1
                        renderMessage={tooltip("top left")}
                        validationInfo={validateMaintenanceDate(maxDate, minDate, date)}
                    >
                        <DateInput
                            value={format(date || currentDate, "dd/MM/yyyy")}
                            maxDate={maxDate && formatDateToCalendarDate(maxDate)}
                            minDate={minDate && formatDateToCalendarDate(minDate)}
                            onValueChange={handleInputDateChange}
                            width="95px"
                        />
                    </ValidationWrapperV1>
                </ValidationContainer>
                <span style={{ color: theme.textColorSecondary }}> {timeZone}</span>
                <Button use="primary" onClick={handleSet}>
                    Set
                </Button>
            </footer>
        </div>
    );
}
