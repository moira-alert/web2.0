import React, { useEffect, FC, useState } from "react";
import { useLazyGetContactNoisinessQuery } from "../../services/ContactApi";
import { getUnixTime, subDays, subHours } from "date-fns";
import transformPageFromHumanToProgrammer from "../../logic/transformPageFromHumanToProgrammer";
import { NoisinessDataset } from "../TriggerNoisiness/TiggerNoisinessChart";
import { getColor } from "../Tag/Tag";
import { Paging } from "@skbkontur/react-ui/components/Paging";
import { Flexbox } from "../Flexbox/FlexBox";
import { TimeRangeSelector } from "../TriggerNoisiness/Components/TimeRangeSelector";
import { Spinner } from "@skbkontur/react-ui/components/Spinner";
import { Contact } from "../../Domain/Contact";
import { useModal } from "../../hooks/useModal";
import { ContactNoisinessChartView } from "./Components/ContactNoisinessChartView";
import ContactEditModal from "../ContactEditModal/ContactEditModal";
import classNames from "classnames/bind";

import styles from "../../../local_modules/styles/mixins.less";

const cn = classNames.bind(styles);

export const ContactNoisinessChart: FC = () => {
    const [page, setPage] = useState(1);
    const maxDate = new Date();
    const minDate = subDays(new Date(), 7);
    const [fromTime, setFromTime] = useState<Date | null>(subHours(maxDate, 1));
    const [untilTime, setUntilTime] = useState<Date | null>(maxDate);
    const [trigger, result] = useLazyGetContactNoisinessQuery();
    const { data: contacts, isLoading, isFetching } = result;
    const [datasets, setDatasets] = useState<NoisinessDataset[]>([]);
    const [contact, setContact] = useState<Contact | null>(null);
    const { isModalOpen, closeModal, openModal } = useModal();
    const pageCount = Math.ceil((contacts?.total ?? 0) / (contacts?.size ?? 1));

    const handleEditClick = (label: string) => {
        const foundContact = contacts?.list.find((c) => c.name === label || c.value === label);
        if (foundContact) {
            setContact(foundContact);
            openModal();
        }
    };

    const fetchEvents = () =>
        trigger({
            from: fromTime && getUnixTime(fromTime),
            to: untilTime && getUnixTime(untilTime),
            page: transformPageFromHumanToProgrammer(page),
        });

    useEffect(() => {
        if (contacts?.list) {
            setDatasets(
                contacts.list.map(({ name, events_count, id, value }) => ({
                    label: name ?? value,
                    data: [events_count],
                    backgroundColor: getColor(id).backgroundColor,
                }))
            );
        }
    }, [contacts]);

    useEffect(() => {
        fetchEvents();
    }, [page]);

    return (
        <>
            {isLoading || isFetching ? (
                <Spinner className={cn("noisinessSpinner")} />
            ) : (
                <Flexbox direction="column" gap={18}>
                    {isModalOpen && (
                        <ContactEditModal showOwner contactInfo={contact} onCancel={closeModal} />
                    )}
                    <ContactNoisinessChartView datasets={datasets} onEditClick={handleEditClick} />
                    <Flexbox direction="row" justify="space-between">
                        <TimeRangeSelector
                            fromTime={fromTime}
                            untilTime={untilTime}
                            setFromTime={setFromTime}
                            setUntilTime={setUntilTime}
                            minDate={minDate}
                            maxDate={maxDate}
                            onApply={fetchEvents}
                        />
                        <Paging
                            activePage={page}
                            pagesCount={pageCount}
                            onPageChange={setPage}
                            withoutNavigationHint
                        />
                    </Flexbox>
                </Flexbox>
            )}
        </>
    );
};
