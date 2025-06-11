import React, { FC } from "react";
import StatusIcon from "../StatusIcon/StatusIcon";
import { getStatusCaption, Status } from "../../Domain/Status";
import { DropdownMenu } from "@skbkontur/react-ui";
import { Button } from "@skbkontur/react-ui/components/Button";
import Filter from "@skbkontur/react-icons/Filter";
import { Checkbox } from "@skbkontur/react-ui/components/Checkbox";
import classNames from "classnames/bind";

import styles from "./FilterStatusSelect.module.less";

const cn = classNames.bind(styles);

interface IFilterStatusSelectProps {
    availableStatuses: Status[];
    selectedStatuses: Status[];
    onSelect: (statuses: Status[]) => void;
}

export const FilterStatusSelect: FC<IFilterStatusSelectProps> = ({
    availableStatuses,
    selectedStatuses,
    onSelect,
}) => {
    const handleSetSelectedStatuses = (status: Status, isChecked: boolean) => {
        if (!isChecked) {
            onSelect(selectedStatuses.filter((s) => s !== status));
        } else onSelect([...selectedStatuses, status]);
    };

    return (
        <DropdownMenu
            caption={({ openMenu }) => (
                <Button icon={<Filter />} onClick={() => openMenu()}>
                    {selectedStatuses.length
                        ? selectedStatuses.map((status) => (
                              <span key={status} className={cn("filter-status-icon")}>
                                  <StatusIcon status={status} />
                              </span>
                          ))
                        : "Filter by state"}
                </Button>
            )}
        >
            {availableStatuses.map((status) => (
                <div key={status} className={cn("dropdown-checkbox-item")}>
                    <Checkbox
                        className={cn("dropdown-checkbox")}
                        checked={selectedStatuses.includes(status)}
                        onValueChange={(value) => handleSetSelectedStatuses(status, value)}
                    >
                        <StatusIcon status={status} />
                        &nbsp;
                        {getStatusCaption(status)}
                    </Checkbox>
                </div>
            ))}
        </DropdownMenu>
    );
};
