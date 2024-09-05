import React, { FC, useMemo, useRef } from "react";
import { Paging } from "@skbkontur/react-ui/components/Paging";
import EventList from "../../../EventList/EventList";
import { useDebounce } from "../../../../hooks/useDebounce";
import { Input } from "@skbkontur/react-ui/components/Input";
import { FilterStatusSelect } from "../../../FilterStatusSelect/FilterStatusSelect";
import { DateAndTimeMenu } from "../../../DateAndTimeMenu/DateAndTimeMenu";
import { getUnixTime, isAfter } from "date-fns";
import { useGetTriggerEventsQuery } from "../../../../services/TriggerApi";
import { Status, StatusesList } from "../../../../Domain/Status";
import transformPageFromHumanToProgrammer from "../../../../logic/transformPageFromHumanToProgrammer";
import { useParams } from "react-router";
import { Center } from "@skbkontur/react-ui/components/Center";
import { Search } from "@skbkontur/react-icons";
import { Loader } from "@skbkontur/react-ui/components/Loader";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { validateTriggerEventsDateFilters } from "../../../../helpers/validations";
import { composeEvents } from "../../../../helpers/composeTriggerEvents";
import { useQueryState } from "../../../../hooks/useQueryState";
import classNames from "classnames/bind";

import styles from "./EventListTab.less";
import { useDateQueryState } from "../../../../hooks/useDateQueryState";

const cn = classNames.bind(styles);

export const EventListTab: FC = () => {
    const [selectedStatuses, setSelectedStatuses] = useQueryState<Status[]>("states", []);
    const [searchMetric, setSearchMetric] = useQueryState<string>("metric", "");
    const [fromTime, setFromTime] = useDateQueryState("from", null);
    const [untilTime, setUntilTime] = useDateQueryState("to", null);
    const [page, setPage] = useQueryState<number>("page", 1);
    const validationContainerRef = useRef(null);
    const { id: triggerId } = useParams<{ id: string }>();
    const debouncedSearchMetric = useDebounce(searchMetric, 500);

    const { data: events, isLoading, isFetching } = useGetTriggerEventsQuery(
        {
            triggerId,
            page: transformPageFromHumanToProgrammer(page),
            states: selectedStatuses,
            metric: debouncedSearchMetric,
            from: fromTime && getUnixTime(fromTime),
            to: untilTime && getUnixTime(untilTime),
            handleLoadingLocally: true,
        },
        { skip: Boolean(fromTime && untilTime && isAfter(fromTime, untilTime)) }
    );
    const grouppedEvents = useMemo(() => composeEvents(events?.list || [], triggerId), [events]);
    const pageCount = Math.ceil((events?.total ?? 0) / (events?.size ?? 1));
    return (
        <>
            <div className={cn("filter-buttons")}>
                <Input
                    width={340}
                    rightIcon={Search}
                    value={searchMetric}
                    onValueChange={setSearchMetric}
                    placeholder="Filter by metric name"
                />
                <FilterStatusSelect
                    availableStatuses={StatusesList.filter((x) => x !== Status.DEL)}
                    selectedStatuses={selectedStatuses}
                    onSelect={setSelectedStatuses}
                />
                <ValidationContainer ref={validationContainerRef}>
                    <div className={cn("from-to-filter")}>
                        <DateAndTimeMenu
                            validateDateAndTime={() =>
                                fromTime &&
                                untilTime &&
                                validateTriggerEventsDateFilters(fromTime, untilTime)
                            }
                            date={fromTime}
                            setDate={setFromTime}
                        />
                        {"—"}
                        <DateAndTimeMenu
                            validateDateAndTime={() =>
                                fromTime &&
                                untilTime &&
                                validateTriggerEventsDateFilters(fromTime, untilTime)
                            }
                            date={untilTime}
                            setDate={setUntilTime}
                        />
                    </div>
                </ValidationContainer>
            </div>
            <Loader active={isLoading || isFetching}>
                {events?.list.length !== 0 ? (
                    <>
                        <EventList items={grouppedEvents} />
                        {pageCount > 1 && (
                            <div style={{ paddingTop: 20 }}>
                                <Paging
                                    caption="Next page"
                                    activePage={page}
                                    pagesCount={pageCount}
                                    onPageChange={setPage}
                                    withoutNavigationHint
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <Center>
                        <span style={{ color: "#888888" }}>
                            There is no events evaluated for this trigger.
                        </span>
                    </Center>
                )}
            </Loader>
        </>
    );
};
