import React, { FC } from "react";
import { Status } from "../../Domain/Status";
import { Flexbox } from "../Flexbox/FlexBox";
import { FilterStatusSelect } from "../FilterStatusSelect/FilterStatusSelect";
import ArrowBoldRightIcon from "@skbkontur/react-icons/ArrowBoldRight";
import { Checkbox } from "@skbkontur/react-ui/components/Checkbox";

interface NotificationFiltersPanelProps {
    prevStateFilter: Status[];
    currentStateFilter: Status[];
    allPrevStates: Status[];
    allCurrentStates: Status[];
    isStrictMatching: boolean;
    onChangePrev: (value: Status[]) => void;
    onChangeCurr: (value: Status[]) => void;
    onToggleStrict: (value: boolean) => void;
}

export const NotificationFiltersPanel: FC<NotificationFiltersPanelProps> = ({
    prevStateFilter,
    onChangePrev,
    allPrevStates,
    currentStateFilter,
    onChangeCurr,
    allCurrentStates,
    onToggleStrict,
    isStrictMatching,
}) => {
    return (
        <Flexbox direction="row" gap={30}>
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
        </Flexbox>
    );
};
