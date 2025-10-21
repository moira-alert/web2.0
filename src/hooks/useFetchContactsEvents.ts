import { useState } from "react";
import { getUnixTime } from "date-fns";
import { Contact } from "../Domain/Contact";
import {
    DtoContactEventItem,
    DtoContactEventItemList,
} from "../Domain/__generated__/data-contracts";
import { useLazyGetContactEventsQuery } from "../services/ContactApi";
import transformPageFromHumanToProgrammer from "../logic/transformPageFromHumanToProgrammer";

interface IUseFetchContactsEventsProps {
    selectedContacts: Contact[];
    fromTime: Date | null;
    untilTime: Date | null;
    page: number;
    isMultiSelect: boolean;
}

interface IUseFetchContactsEventsReturn {
    fetchEvents: (overridePage?: number) => Promise<void>;
    allContactEvents: DtoContactEventItem[];
    isLoading: boolean;
    isFetching: boolean;
    contactEventsList?: DtoContactEventItemList;
}

export const useFetchContactsEvents = ({
    selectedContacts,
    fromTime,
    untilTime,
    page,
    isMultiSelect,
}: IUseFetchContactsEventsProps): IUseFetchContactsEventsReturn => {
    const [trigger, result] = useLazyGetContactEventsQuery();
    const { data: contactEventsList, isLoading, isFetching } = result;

    const [allContactEvents, setAllContactEvents] = useState<DtoContactEventItem[]>([]);

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

    return {
        fetchEvents,
        allContactEvents,
        isLoading,
        isFetching,
        contactEventsList,
    };
};
