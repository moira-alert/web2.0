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
import { Paging } from "@skbkontur/react-ui/components/Paging";
import transformPageFromHumanToProgrammer from "../../logic/transformPageFromHumanToProgrammer";
import { TokenInput } from "@skbkontur/react-ui/components/TokenInput";
import { Contact } from "../../Domain/Contact";
import { Token } from "@skbkontur/react-ui/components/Token";
import { DtoContactEventItem } from "../../Domain/__generated__/data-contracts";
import classNames from "classnames/bind";

import styles from "./ContactEventStats.module.less";

const cn = classNames.bind(styles);

interface IContactEventStatsProps {
    contact: Contact;
    onClose: () => void;
    contacts: Contact[];
}

export const ContactEventStats: FC<IContactEventStatsProps> = ({ contact, onClose, contacts }) => {
    const maxDate = new Date();
    const minDate = subDays(new Date(), 7);
    const [fromTime, setFromTime] = useState<Date | null>(minDate);
    const [untilTime, setUntilTime] = useState<Date | null>(maxDate);
    const [page, setPage] = useState(1);
    const [selectedContacts, setSelectedContacts] = useState<Contact[]>([contact]);
    const [allContactEvents, setAllContactEvents] = useState<DtoContactEventItem[]>([]);
    const [isValid, setIsValid] = useState(true);

    const isMultiSelect = selectedContacts.length > 1;

    const { error } = useAppSelector(UIState);
    const validationContainerRef = useRef<ValidationContainer>(null);

    const [trigger, result] = useLazyGetContactEventsQuery();
    const { data: contactEventsList, isLoading, isFetching } = result;

    const pageCount = Math.ceil((contactEventsList?.total ?? 0) / (contactEventsList?.size ?? 1));

    const fetchEvents = async (overridePage?: number) => {
        if (!selectedContacts.length) {
            setAllContactEvents([]);
            return;
        }

        if (isMultiSelect) {
            const results = await Promise.all(
                selectedContacts.map((c) =>
                    trigger({
                        contactId: c.id,
                        from: fromTime && getUnixTime(fromTime),
                        to: untilTime && getUnixTime(untilTime),
                        handleLoadingLocally: true,
                        page: 0,
                        size: -1,
                    }).unwrap()
                )
            );
            const mergedEvents = results.flatMap((r) => r.list ?? []);
            setAllContactEvents(mergedEvents);
        } else {
            const result = await trigger({
                contactId: selectedContacts[0].id,
                from: fromTime && getUnixTime(fromTime),
                to: untilTime && getUnixTime(untilTime),
                handleLoadingLocally: true,
                page: transformPageFromHumanToProgrammer(overridePage ?? page),
            }).unwrap();
            setAllContactEvents(result.list ?? []);
        }
    };

    const runWithValidation = (callback?: () => void) => {
        if (!isValid) return;
        if (callback) callback();
    };

    const handleApplyTimeRange = () => {
        runWithValidation(() => {
            setPage(1);
            fetchEvents(1);
        });
    };

    const handlePageChange = (newPage: number) => {
        runWithValidation(() => {
            setPage(newPage);
            fetchEvents(newPage);
        });
    };

    useEffect(() => {
        const validate = async () => {
            const valid = await validateForm(validationContainerRef);
            setIsValid(valid);
        };
        validate();
    }, [fromTime, untilTime]);

    useEffect(() => {
        if (isValid) {
            runWithValidation(fetchEvents);
        }
    }, [selectedContacts, isValid]);

    return error ? null : (
        <SidePage width={800} onClose={onClose}>
            <SidePageHeader>
                Contact events
                {allContactEvents?.length ? `: ${allContactEvents?.length}` : ""}
            </SidePageHeader>
            <SidePageContainer>
                <SidePageBody>
                    <Flexbox gap={24}>
                        <TokenInput
                            disabled={!isValid}
                            width="100%"
                            selectedItems={selectedContacts}
                            onValueChange={setSelectedContacts}
                            renderValue={(item) => item.name || item.value}
                            renderItem={(item) => item.name || item.value}
                            renderToken={(item, tokenProps) => (
                                <Token key={item.id} {...tokenProps}>
                                    {item.name || item.value}
                                </Token>
                            )}
                            getItems={() =>
                                Promise.resolve(contacts.filter((c) => c.id !== contact.id))
                            }
                        />
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
                    </Flexbox>

                    {isLoading || isFetching ? (
                        <Spinner className={cn("empty-container")} />
                    ) : allContactEvents?.length ? (
                        <Flexbox className={cn("container")} gap={50}>
                            {!isMultiSelect && (
                                <Paging
                                    className={cn("paging")}
                                    activePage={page}
                                    pagesCount={pageCount}
                                    onPageChange={handlePageChange}
                                    withoutNavigationHint
                                />
                            )}
                            <TriggerEventsChart events={allContactEvents} />
                            <ContactEventsChart events={allContactEvents} />
                        </Flexbox>
                    ) : (
                        <div className={cn("empty-container")}>No events found</div>
                    )}
                </SidePageBody>
            </SidePageContainer>
        </SidePage>
    );
};
