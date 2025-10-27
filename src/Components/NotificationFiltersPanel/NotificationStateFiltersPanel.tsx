import React, { FC } from "react";
import { Status } from "../../Domain/Status";
import { Flexbox } from "../Flexbox/FlexBox";
import { FilterStatusSelect } from "../FilterStatusSelect/FilterStatusSelect";
import ArrowBoldRightIcon from "@skbkontur/react-icons/ArrowBoldRight";
import { Checkbox } from "@skbkontur/react-ui/components/Checkbox";
import { Button } from "@skbkontur/react-ui/components/Button";
import Refresh3 from "@skbkontur/react-icons/Refresh3";

interface INotificationStateFiltersPanelProps {
    prevStateFilter: Status[];
    currentStateFilter: Status[];
    allPrevStates: Status[];
    allCurrentStates: Status[];
    isStrictMatching: boolean;
    onChangePrev: (value: Status[]) => void;
    onChangeCurr: (value: Status[]) => void;
    onToggleStrict: (value: boolean) => void;
}

export const NotificationStateFiltersPanel: FC<INotificationStateFiltersPanelProps> = ({
    prevStateFilter,
    onChangePrev,
    allPrevStates,
    currentStateFilter,
    onChangeCurr,
    allCurrentStates,
    onToggleStrict,
    isStrictMatching,
}) => {
    const handleReset = () => {
        onChangePrev([]);
        onChangeCurr([]);
        onToggleStrict(false);
    };

    const isResetBtnShown =
        prevStateFilter.length !== 0 || currentStateFilter.length !== 0 || isStrictMatching;

    return (
        <Flexbox direction="row" gap={24}>
            <FilterStatusSelect
                selectedStatuses={prevStateFilter}
                onSelect={onChangePrev}
                availableStatuses={allPrevStates}
                text="Filter by prev state"
            />
            <ArrowBoldRightIcon size={28} />
            <FilterStatusSelect
                selectedStatuses={currentStateFilter}
                onSelect={onChangeCurr}
                availableStatuses={allCurrentStates}
                text="Filter by current state"
            />
            <Checkbox onValueChange={onToggleStrict} checked={isStrictMatching}>
                Match all selected statuses
            </Checkbox>
            {isResetBtnShown && <Button use="text" onClick={handleReset} icon={<Refresh3 />} />}
        </Flexbox>
    );
};
