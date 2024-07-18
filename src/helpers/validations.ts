import { ValidationContainer, ValidationInfo } from "@skbkontur/react-ui-validations";
import { Nullable } from "@skbkontur/react-ui-validations/typings/Types";
import { format, isAfter, isBefore, startOfDay, startOfMinute } from "date-fns";

export const validateContactValueWithConfigRegExp = (
    value?: string,
    regExp?: string
): ValidationInfo | null => {
    if (!value) {
        return {
            message: "Contact value can`t be empty",
            type: "submit",
        };
    }

    if (!regExp) {
        return null;
    }

    const re = new RegExp(regExp, "i");

    return value.trim().match(re)
        ? null
        : {
              message: "Invalid format",
              type: "submit",
          };
};

export const validateForm = async (
    validationContainer: React.RefObject<ValidationContainer>
): Promise<boolean> => {
    if (!validationContainer.current) {
        return true;
    }
    return validationContainer.current.validate();
};

const validateDateAndTimeString = (date: string): boolean => {
    const datePattern = /^\d{4}\/\d{2}\/\d{2} \d{2}:\d{2}:\d{2}$/;
    return datePattern.test(date);
};

export const validateDateAndTime = (
    date: Date,
    inputValue: string,
    maxDate: Date,
    minDate: Date,
    fromTime: Date,
    untillTime: Date
): Nullable<ValidationInfo> => {
    const dateMinute = startOfMinute(date);
    const minMinute = startOfMinute(minDate);
    const maxMinute = startOfMinute(maxDate);
    const fromMinute = startOfMinute(fromTime);
    const untillMinute = startOfMinute(untillTime);

    if (isBefore(untillMinute, fromMinute)) {
        return {
            message: "From date should be before untill date",
            type: "immediate",
        };
    }

    if (isBefore(dateMinute, minMinute)) {
        return {
            message: `Date should not be before ${format(minMinute, "yyyy/MM/dd HH:mm")}`,
            type: "immediate",
        };
    }

    if (isAfter(dateMinute, maxMinute)) {
        return {
            message: `Date should not be after ${format(maxMinute, "yyyy/MM/dd HH:mm")}`,
            type: "immediate",
        };
    }

    if (!validateDateAndTimeString(inputValue)) {
        return {
            message: "Please enter a date",
            type: "submit",
        };
    }

    return null;
};

export const validateMaintenanceDate = (
    maxDate?: Date,
    minDate?: Date,
    date?: Date
): Nullable<ValidationInfo> => {
    const selectedDate = date && startOfDay(date);
    const min = minDate && startOfDay(minDate);
    const max = maxDate && startOfDay(maxDate);
    if (!selectedDate) {
        return {
            message: "Please enter a date",
            type: "immediate",
        };
    }
    if (max && isAfter(selectedDate, max)) {
        return {
            message: `The maximum date is ${format(maxDate, "yyyy/MM/dd HH:mm")} now`,
            type: "immediate",
        };
    }
    if (min && isBefore(selectedDate, min)) {
        return {
            message: `Maintenance date must be in the future`,
            type: "immediate",
        };
    }
    return null;
};
