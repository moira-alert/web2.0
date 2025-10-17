import React, { FC, useEffect, useRef, useState } from "react";
import { SidePage, SidePageBody, SidePageContainer, SidePageHeader } from "@skbkontur/react-ui";
import { TriggerEventsChart } from "./Components/TriggerEventsChart";
import { ContactEventsChart } from "./Components/ContactEventsChart";
import { Spinner } from "@skbkontur/react-ui/components/Spinner";
import { Button } from "@skbkontur/react-ui/components/Button";
import { DateAndTimeMenu } from "../DateAndTimeMenu/DateAndTimeMenu";
import { useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";
import { subDays } from "date-fns";
import { ValidationContainer, ValidationWrapperV1 } from "@skbkontur/react-ui-validations";
import { validateDateAndTime, validateForm } from "../../helpers/validations";
import { Flexbox } from "../Flexbox/FlexBox";
import { Paging } from "@skbkontur/react-ui/components/Paging";
import { TokenInput } from "@skbkontur/react-ui/components/TokenInput";
import { Contact } from "../../Domain/Contact";
import { Token } from "@skbkontur/react-ui/components/Token";
import { useFetchContactsEvents } from "../../hooks/useFetchContactsEvents";
import { FormRow } from "../TriggerEditForm/Components/Form";
import classNames from "classnames/bind";

import styles from "./ContactEventStats.module.less";

const cn = classNames.bind(styles);

interface IContactEventStatsProps {
    contact?: Contact;
    onClose: () => void;
    contacts: Contact[];
}

export const ContactEventStats: FC<IContactEventStatsProps> = ({ contact, onClose, contacts }) => {
    const maxDate = new Date();
    const minDate = subDays(new Date(), 7);
    const [fromTime, setFromTime] = useState<Date | null>(minDate);
    const [untilTime, setUntilTime] = useState<Date | null>(maxDate);
    const [page, setPage] = useState(1);
    const [selectedContacts, setSelectedContacts] = useState<Contact[]>(contact ? [contact] : []);

    const isMultiSelect = selectedContacts.length > 1;

    const { error } = useAppSelector(UIState);
    const validationContainerRef = useRef<ValidationContainer>(null);

    const {
        fetchEvents,
        allContactEvents,
        isLoading,
        isFetching,
        contactEventsList,
    } = useFetchContactsEvents({
        selectedContacts,
        fromTime,
        untilTime,
        page,
        isMultiSelect,
    });

    const pageCount = Math.ceil((contactEventsList?.total ?? 0) / (contactEventsList?.size ?? 1));

    const runWithValidation = async (callback: () => void) => {
        const valid = await validateForm(validationContainerRef);
        if (!valid) return;
        callback();
    };

    const handleSubmit = () => {
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

    const getItems = React.useCallback(
        (query: string) =>
            Promise.resolve(
                contacts.filter((c) => {
                    const q = query.toLowerCase().trim();
                    const text = (c.name || c.value || "").toLowerCase();
                    return !q || text.includes(q);
                })
            ),
        [selectedContacts.length]
    );

    const getItem = (item: Contact) => item.name || item.value;

    useEffect(() => {
        fetchEvents();
    }, []);

    return error ? null : (
        <SidePage className={cn("side-page")} width={800} onClose={onClose}>
            <SidePageHeader>
                Contact events
                {allContactEvents?.length ? `: ${allContactEvents?.length}` : ""}
            </SidePageHeader>
            <SidePageContainer>
                <SidePageBody>
                    <ValidationContainer ref={validationContainerRef}>
                        <FormRow label="Contacts">
                            <ValidationWrapperV1
                                validationInfo={
                                    selectedContacts.length === 0
                                        ? {
                                              type: "immediate",
                                              message: "Select at least one contact",
                                          }
                                        : null
                                }
                            >
                                <TokenInput
                                    width="100%"
                                    selectedItems={selectedContacts}
                                    onValueChange={setSelectedContacts}
                                    renderValue={getItem}
                                    renderItem={getItem}
                                    renderToken={(item, tokenProps) => (
                                        <Token key={item.id} {...tokenProps}>
                                            {item.name || item.value}
                                        </Token>
                                    )}
                                    valueToString={getItem}
                                    getItems={getItems}
                                />
                            </ValidationWrapperV1>
                        </FormRow>

                        <FormRow label="Absolute time range">
                            <Flexbox direction="row" gap={10} align="baseline">
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
                                <Button width="100%" onClick={handleSubmit} use="primary">
                                    Load events
                                </Button>
                            </Flexbox>
                        </FormRow>
                    </ValidationContainer>

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
