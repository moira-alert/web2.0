import React, { FC, useMemo, useRef } from "react";
import { Paging } from "@skbkontur/react-ui/components/Paging";
import EventList from "../../../EventList/EventList";
import { useDebounce } from "../../../../hooks/useDebounce";
import { SearchInput } from "../SearchInput/SearchInput";
import { FilterStatusSelect } from "../../../FilterStatusSelect/FilterStatusSelect";
import { DateAndTimeMenu } from "../../../DateAndTimeMenu/DateAndTimeMenu";
import { getUnixTime, isAfter } from "date-fns";
import { useGetTriggerEventsQuery } from "../../../../services/TriggerApi";
import { Status, StatusesList } from "../../../../Domain/Status";
import transformPageFromHumanToProgrammer from "../../../../logic/transformPageFromHumanToProgrammer";
import { useParams } from "react-router";
import { Loader } from "@skbkontur/react-ui/components/Loader";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { validateTriggerEventsDateFilters } from "../../../../helpers/validations";
import { composeEvents } from "../../../../helpers/composeTriggerEvents";
import { useQueryState } from "../../../../hooks/useQueryState";
import { useDateQueryState } from "../../../../hooks/useDateQueryState";
import { useAppDispatch } from "../../../../store/hooks";
import { setError } from "../../../../store/Reducers/UIReducer.slice";
import { Flexbox } from "../../../Flexbox/FlexBox";
import { EmptyListText } from "../EmptyListMessage/EmptyListText";
import classNames from "classnames/bind";

import styles from "./EventListTab.less";

const cn = classNames.bind(styles);
interface IEventListTabProps {
    triggerName: string;
}

export const EventListTab: FC<IEventListTabProps> = ({ triggerName }) => {
    const [selectedStatuses, setSelectedStatuses] = useQueryState<Status[]>("states", []);
    const [searchMetric, setSearchMetric] = useQueryState<string>("metric", "");
    const [fromTime, setFromTime] = useDateQueryState("from", null);
    const [untilTime, setUntilTime] = useDateQueryState("to", null);
    const [page, setPage] = useQueryState<number>("page", 1);
    const validationContainerRef = useRef(null);
    const { id: triggerId } = useParams<{ id: string }>();
    const debouncedSearchMetric = useDebounce(searchMetric, 500);
    const dispatch = useAppDispatch();

    const handleInputValueChange = (value: string) => {
        dispatch(setError(null));
        setSearchMetric(value);
    };

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
    const grouppedEvents = useMemo(() => composeEvents(events?.list || [], triggerName), [events]);
    const pageCount = Math.ceil((events?.total ?? 0) / (events?.size ?? 1));
    return (
        <Flexbox margin="28px 0 0 0" gap={28}>
            <Flexbox direction="row" justify="space-between">
                <SearchInput
                    placeholder="Filter by metric name, regExp is supported"
                    width={340}
                    value={searchMetric}
                    onValueChange={handleInputValueChange}
                    onClear={() => setSearchMetric("")}
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
            </Flexbox>
            <Loader active={isLoading || isFetching}>
                {events?.list.length !== 0 ? (
                    <>
                        <EventList items={grouppedEvents} />
                        {pageCount > 1 && (
                            <div style={{ paddingTop: 20 }}>
                                <Paging
                                    caption="Next page"
                                    activePage={+page}
                                    pagesCount={pageCount}
                                    onPageChange={setPage}
                                    withoutNavigationHint
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <EmptyListText text={"There is no events evaluated for this trigger."} />
                )}
            </Loader>
        </Flexbox>
    );
};
