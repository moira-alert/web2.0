import React, { useEffect, FC, useState } from "react";
import { useLazyGetTriggerNoisinessQuery } from "../../services/TriggerApi";
import { getColor } from "../../Components/Tag/Tag";
import { Paging } from "@skbkontur/react-ui/components/Paging";
import transformPageFromHumanToProgrammer from "../../logic/transformPageFromHumanToProgrammer";
import { getUnixTime, subDays, subHours } from "date-fns";
import { Flexbox } from "../Flexbox/FlexBox";
import { TriggerNoisinessChartView } from "./Components/TriggerNoisinessChartView";
import { TimeRangeSelector } from "./Components/TimeRangeSelector";
import { Spinner } from "@skbkontur/react-ui/components/Spinner";

import styles from "~styles/utils.module.less";

export type NoisinessDataset = {
    label: string;
    data: number[];
    backgroundColor: string;
};

export const TriggerNoisinessChart: FC = () => {
    const [page, setPage] = useState(1);
    const maxDate = new Date();
    const minDate = subDays(new Date(), 7);
    const [fromTime, setFromTime] = useState<Date | null>(subHours(maxDate, 1));
    const [untilTime, setUntilTime] = useState<Date | null>(maxDate);

    const [trigger, result] = useLazyGetTriggerNoisinessQuery();
    const { data: triggers, isLoading, isFetching } = result;

    const [datasets, setDatasets] = useState<NoisinessDataset[]>([]);
    const pageCount = Math.ceil((triggers?.total ?? 0) / (triggers?.size ?? 1));

    useEffect(() => {
        if (triggers?.list) {
            setDatasets(
                triggers.list.map(({ name, events_count, id }) => ({
                    label: name,
                    data: [events_count],
                    backgroundColor: getColor(id).backgroundColor,
                }))
            );
        }
    }, [triggers]);

    const fetchEvents = () =>
        trigger({
            from: fromTime && getUnixTime(fromTime),
            to: untilTime && getUnixTime(untilTime),
            page: transformPageFromHumanToProgrammer(page),
        });

    useEffect(() => {
        fetchEvents();
    }, [page]);

    return (
        <>
            {isLoading || isFetching ? (
                <Spinner className={styles.noisinessSpinner} />
            ) : (
                <>
                    {triggers?.total && (
                        <Flexbox direction="column" gap={18}>
                            <div id="trigger-events-legend-container" />
                            <TriggerNoisinessChartView datasets={datasets} triggers={triggers} />
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
            )}
        </>
    );
};
