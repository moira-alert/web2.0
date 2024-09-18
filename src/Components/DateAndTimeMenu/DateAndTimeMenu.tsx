import React, { useState, useRef, useEffect, FC } from "react";
import { RenderLayer } from "@skbkontur/react-ui/internal/RenderLayer";
import { DropdownContainer } from "@skbkontur/react-ui/internal/DropdownContainer";
import { Input } from "@skbkontur/react-ui/components/Input";
import CalendarIcon from "@skbkontur/react-icons/Calendar";
import { DateAndTimeSelector } from "../DateAndTimeSelector/DateAndTimeSelector";
import { format, parse } from "date-fns";
import { ValidationInfo, ValidationWrapperV1 } from "@skbkontur/react-ui-validations";
import { Nullable } from "@skbkontur/react-ui-validations/typings/Types";
import { useModal } from "../../hooks/useModal";
import classNames from "classnames/bind";

import styles from "./DateAndTimeMenu.less";

const cn = classNames.bind(styles);

interface IDateAndTimeMenuProps {
    date?: Date | null;
    setDate: (date: Date | null) => void;
    minDate?: Date;
    maxDate?: Date;
    validateDateAndTime?: (inputValue: string) => Nullable<ValidationInfo>;
}

export const DateAndTimeMenu: FC<IDateAndTimeMenuProps> = ({
    date,
    setDate,
    minDate,
    maxDate,
    validateDateAndTime,
}) => {
    const { openModal: openMenu, closeModal: closeMenu, isModalOpen: isMenuOpen } = useModal();
    const [inputValue, setInputValue] = useState<string>("");
    const containerEl = useRef(null);

    const handleValueChange = (value: string) => {
        setInputValue(value);

        if (!value) {
            setDate(null);
            return;
        }

        const parsedDate = parse(value, "yyyy/MM/dd HH:mm:ss", new Date());
        if (!isNaN(parsedDate.getTime())) {
            setDate(parsedDate);
        }
    };

    useEffect(() => {
        date && setInputValue(format(date, "yyyy/MM/dd HH:mm:ss"));
    }, [date]);

    return (
        <RenderLayer onClickOutside={closeMenu} onFocusOutside={closeMenu} active={isMenuOpen}>
            <div ref={containerEl}>
                <ValidationWrapperV1
                    validationInfo={validateDateAndTime && validateDateAndTime(inputValue)}
                >
                    <Input
                        width={160}
                        mask={"9999/99/99 99:99:99"}
                        onFocus={closeMenu}
                        value={inputValue}
                        onValueChange={handleValueChange}
                    />
                </ValidationWrapperV1>
                <CalendarIcon className={cn("calendar-icon")} onClick={openMenu} />
                {isMenuOpen && (
                    <DropdownContainer
                        offsetY={5}
                        getParent={() => containerEl.current}
                        align="right"
                    >
                        <DateAndTimeSelector
                            date={date}
                            setDate={setDate}
                            minDate={minDate}
                            maxDate={maxDate}
                        />
                    </DropdownContainer>
                )}
            </div>
        </RenderLayer>
    );
};
