import React, { FC, useEffect, useRef, useState } from "react";
import { useLazyGetContactEventsQuery } from "../../services/ContactApi";
import { SidePage, SidePageBody, SidePageContainer, SidePageHeader } from "@skbkontur/react-ui";
import { TriggerEventsChart } from "./Components/TriggerEventsChart";
import { ContactEventsChart } from "./Components/ContactEventsChart";
import { Spinner } from "@skbkontur/react-ui/components/Spinner";
import { Button } from "@skbkontur/react-ui/components/Button";
import { DateAndTimeMenu } from "../DateAndTimeMenu/DateAndTimeMenu";
import { useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";
import { getUnixTime, subDays } from "date-fns";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { validateDateAndTime, validateForm } from "../../helpers/validations";
import { Flexbox } from "../Flexbox/FlexBox";
import classNames from "classnames/bind";

import styles from "./ContactEventStats.module.less";

const cn = classNames.bind(styles);

interface IContactEventStatsProps {
    contactId: string;
    onClose: () => void;
}

export const ContactEventStats: FC<IContactEventStatsProps> = ({ contactId, onClose }) => {
    const maxDate = new Date();
    const minDate = subDays(new Date(), 7);
    const [fromTime, setFromTime] = useState<Date | null>(minDate);
    const [untilTime, setUntilTime] = useState<Date | null>(maxDate);
    const { error } = useAppSelector(UIState);
    const validationContainerRef = useRef(null);

    const [trigger, result] = useLazyGetContactEventsQuery();

    const { data: contactEvents, isLoading, isFetching } = result;

    const fetchEvents = () =>
        trigger({
            contactId,
            from: fromTime && getUnixTime(fromTime),
            to: untilTime && getUnixTime(untilTime),
            handleLoadingLocally: true,
        });

    const handleApplyTimeRange = async () => {
        const validationSuccess = await validateForm(validationContainerRef);
        if (!validationSuccess) {
            return;
        }
        fetchEvents();
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    return error ? null : (
        <SidePage width={800} onClose={onClose}>
            <SidePageHeader>
                Contact events{contactEvents?.length ? `: ${contactEvents?.length}` : ""}
            </SidePageHeader>
            <SidePageContainer>
                <SidePageBody>
                    <ValidationContainer ref={validationContainerRef}>
                        <div className={cn("time-range-container")}>
                            <span>Absolute time range</span>
                            <div className={cn("date-time-pickers")}>
                                <DateAndTimeMenu
                                    validateDateAndTime={(inputValue) =>
                                        fromTime &&
                                        untilTime &&
                                        validateDateAndTime(
                                            fromTime,
                                            inputValue,
                                            fromTime,
                                            untilTime,
                                            maxDate,
                                            minDate
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
                                            fromTime,
                                            untilTime,
                                            maxDate,
                                            minDate
                                        )
                                    }
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    date={untilTime}
                                    setDate={setUntilTime}
                                />
                                <Button onClick={handleApplyTimeRange} use="primary">
                                    Apply time range
                                </Button>
                            </div>
                        </div>
                    </ValidationContainer>

                    {isLoading || isFetching ? (
                        <Spinner className={cn("empty-container")} />
                    ) : contactEvents?.length ? (
                        <Flexbox gap={50}>
                            <TriggerEventsChart events={contactEvents} />
                            <ContactEventsChart events={contactEvents} />
                        </Flexbox>
                    ) : (
                        <div className={cn("empty-container")}>No events found</div>
                    )}
                </SidePageBody>
            </SidePageContainer>
        </SidePage>
    );
};
