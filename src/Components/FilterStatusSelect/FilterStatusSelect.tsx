import React, { FC } from "react";
import StatusIcon from "../StatusIcon/StatusIcon";
import { getStatusCaption, Status } from "../../Domain/Status";
import { Checkbox } from "@skbkontur/react-ui/components/Checkbox";
import { DropdownMenu, ThemeContext, ThemeFactory } from "@skbkontur/react-ui";
import { MenuItem } from "@skbkontur/react-ui/components/MenuItem";
import { Button } from "@skbkontur/react-ui/components/Button";
import Filter from "@skbkontur/react-icons/Filter";
import classNames from "classnames/bind";

import styles from "./FilterStatusSelect.less";

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
                <ThemeContext.Provider
                    key={status}
                    value={ThemeFactory.create({
                        menuItemHoverBg: "initial",
                    })}
                >
                    <MenuItem>
                        <Checkbox
                            className={cn("filter-status-checkbox")}
                            checked={selectedStatuses.includes(status)}
                            onValueChange={(value) => handleSetSelectedStatuses(status, value)}
                        >
                            <StatusIcon status={status} />
                            &nbsp;
                            {getStatusCaption(status)}
                        </Checkbox>
                    </MenuItem>
                </ThemeContext.Provider>
            ))}
        </DropdownMenu>
    );
};
