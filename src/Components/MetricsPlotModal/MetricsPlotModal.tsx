import React, { FC, useEffect, useState } from "react";
import { useLazyGetTriggerPlotQuery } from "../../services/TriggerApi";
import { Modal } from "@skbkontur/react-ui/components/Modal";
import { useModal } from "../../hooks/useModal";
import { LinkMenuItem } from "../TriggerInfo/Components/LinkMenuItem";
import Statistic from "@skbkontur/react-icons/Statistic";
import { useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";
import { EThemesNames } from "../../Themes/themesNames";
import { Spinner } from "@skbkontur/react-ui/components/Spinner";
import { Flexbox } from "../Flexbox/FlexBox";
import { TimeRangeSelector } from "../TriggerNoisiness/Components/TimeRangeSelector";
import { differenceInHours, getUnixTime, subHours } from "date-fns";
import { Select } from "@skbkontur/react-ui/components/Select";
import { Note } from "../Note/Note";
import { pluralizeHours } from "../../helpers/DateUtil";

interface IMetricsPlotModalProps {
    triggerId: string;
    targets: string[];
    metricsTtl: number;
}

export const MetricsPlotModal: FC<IMetricsPlotModalProps> = ({
    triggerId,
    targets,
    metricsTtl,
}) => {
    const { isModalOpen, openModal, closeModal } = useModal();
    const { theme } = useAppSelector(UIState);

    const maxDate = new Date();
    const minDate = new Date(Date.now() - metricsTtl * 1000);
    const ttlHours = differenceInHours(maxDate, minDate);

    const [fromTime, setFromTime] = useState<Date | null>(subHours(maxDate, 1));
    const [untilTime, setUntilTime] = useState<Date | null>(maxDate);

    const [selectedTargetIndex, setSelectedTargetIndex] = useState(0);

    const [trigger, result] = useLazyGetTriggerPlotQuery();
    const { data: imageUrl, isLoading, isFetching, isError } = result;

    const fetchPlot = () =>
        trigger({
            triggerId,
            from: fromTime && getUnixTime(fromTime),
            to: untilTime && getUnixTime(untilTime),
            theme: theme === EThemesNames.Dark ? "dark" : "light",
            handleLoadingLocally: true,
            target: `t${selectedTargetIndex + 1}`,
        });

    useEffect(() => {
        isModalOpen && fetchPlot();
    }, [isModalOpen, selectedTargetIndex]);

    return (
        <>
            <LinkMenuItem onClick={openModal} icon={<Statistic />}>
                Metrics graph
            </LinkMenuItem>
            {isModalOpen && !isError && (
                <Modal onClose={closeModal}>
                    <Modal.Body>
                        {isLoading || isFetching ? (
                            <Flexbox width={800} height={400} align="center" justify="center">
                                <Spinner />
                            </Flexbox>
                        ) : (
                            <Flexbox width={800} gap={18}>
                                <img src={imageUrl} alt="Trigger Plot" />
                                <Note>
                                    The data retention period for this metric source is limited to{" "}
                                    {pluralizeHours(ttlHours)}.
                                </Note>
                                <Flexbox direction="row" justify="space-between">
                                    <TimeRangeSelector
                                        fromTime={fromTime}
                                        untilTime={untilTime}
                                        setFromTime={setFromTime}
                                        setUntilTime={setUntilTime}
                                        minDate={minDate}
                                        maxDate={maxDate}
                                        onApply={fetchPlot}
                                    />
                                    {targets.length > 1 && (
                                        <div>
                                            Target:{" "}
                                            <Select<number>
                                                items={targets.map((_, i) => i)}
                                                value={selectedTargetIndex}
                                                onValueChange={setSelectedTargetIndex}
                                                renderItem={(i) => `t${i + 1}`}
                                                renderValue={(i) => `t${i + 1}`}
                                            />
                                        </div>
                                    )}
                                </Flexbox>
                            </Flexbox>
                        )}
                    </Modal.Body>
                </Modal>
            )}
        </>
    );
};
