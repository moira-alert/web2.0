import React from "react";
import { DateAndTimeMenu } from "../../DateAndTimeMenu/DateAndTimeMenu";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Flexbox } from "../../Flexbox/FlexBox";
import { validateDateAndTime, validateForm } from "../../../helpers/validations";
import { ValidationContainer } from "@skbkontur/react-ui-validations";

export const TimeRangeSelector: React.FC<{
    fromTime: Date | null;
    untilTime: Date | null;
    setFromTime: (date: Date | null) => void;
    setUntilTime: (date: Date | null) => void;
    minDate: Date;
    maxDate: Date;
    onApply: () => void;
}> = ({ fromTime, untilTime, setFromTime, setUntilTime, minDate, maxDate, onApply }) => {
    const validationContainerRef = React.useRef(null);

    const handleApply = async () => {
        const validationSuccess = await validateForm(validationContainerRef);
        if (!validationSuccess) return;
        onApply();
    };

    return (
        <ValidationContainer ref={validationContainerRef}>
            <Flexbox gap={12} direction="row" align="center">
                <DateAndTimeMenu
                    validateDateAndTime={(inputValue) =>
                        fromTime &&
                        untilTime &&
                        validateDateAndTime(
                            fromTime,
                            inputValue,
                            maxDate,
                            minDate,
                            fromTime,
                            untilTime
                        )
                    }
                    minDate={minDate}
                    maxDate={maxDate}
                    date={fromTime}
                    setDate={setFromTime}
                />
                {"—"}
                <DateAndTimeMenu
                    validateDateAndTime={(inputValue) =>
                        fromTime &&
                        untilTime &&
                        validateDateAndTime(
                            untilTime,
                            inputValue,
                            maxDate,
                            minDate,
                            fromTime,
                            untilTime
                        )
                    }
                    minDate={minDate}
                    maxDate={maxDate}
                    date={untilTime}
                    setDate={setUntilTime}
                />
                <Button onClick={handleApply} use="primary">
                    Apply time range
                </Button>
            </Flexbox>
        </ValidationContainer>
    );
};
