import React, { useState } from "react";
import { DropdownMenu, MenuSeparator } from "@skbkontur/react-ui";
import { Checkbox } from "@skbkontur/react-ui/components/Checkbox";
import { Team } from "../../Domain/Team";
import { useParams } from "react-router";
import { Button } from "@skbkontur/react-ui/components/Button";
import { MenuItem } from "@skbkontur/react-ui/components/MenuItem";
import { useAppDispatch } from "../../store/hooks";
import { setIsEnablingSubscriptions } from "../../store/Reducers/UIReducer.slice";
import ArrowChevronDown from "@skbkontur/react-icons/ArrowChevronDown";
import ArrowChevronUp from "@skbkontur/react-icons/ArrowChevronUp";
import classNames from "classnames/bind";

import styles from "./ManageSubscriptionsSelect.less";

const cn = classNames.bind(styles);

interface IManageSubscriptionsSelectProps {
    teams?: Team[];
    teamToTransfer: Team | null;
    handleSetTeamToTransfer: (team: Team) => void;
}

export const ManageSubscriptionsSelect: React.FC<IManageSubscriptionsSelectProps> = ({
    teams,
    teamToTransfer,
    handleSetTeamToTransfer,
}) => {
    const { teamId: currentTeamId } = useParams<{ teamId: string }>();
    const dispatch = useAppDispatch();
    const [isTeamSelectionOpen, setTeamSelectionOpen] = useState(false);

    const possibleTeamsToTransfer = teams?.filter((team) => team.id !== currentTeamId);
    const isTransferAvailable = !!possibleTeamsToTransfer?.length;

    return (
        <DropdownMenu
            caption={({ openMenu }) => (
                <Button width={180} className={cn("manage-btn")} onClick={() => openMenu()}>
                    Manage subscriptions
                </Button>
            )}
        >
            {isTransferAvailable && (
                <MenuItem
                    icon={isTeamSelectionOpen ? <ArrowChevronUp /> : <ArrowChevronDown />}
                    onClick={(e) => {
                        setTeamSelectionOpen((prev) => !prev);
                        e.preventDefault();
                    }}
                    comment={
                        isTeamSelectionOpen ? "Select the team to transfer subscriptions to:" : ""
                    }
                >
                    Transfer subscriptions
                </MenuItem>
            )}
            {isTeamSelectionOpen && (
                <>
                    {possibleTeamsToTransfer?.map((team) => (
                        <div
                            key={team.id}
                            className={cn("dropdown-checkbox-item", "team-selection")}
                        >
                            <Checkbox
                                className={cn("dropdown-checkbox")}
                                checked={teamToTransfer?.id === team.id}
                                onValueChange={() => handleSetTeamToTransfer(team)}
                            >
                                {team.name}
                            </Checkbox>
                        </div>
                    ))}
                </>
            )}
            {isTransferAvailable && <MenuSeparator />}
            <MenuItem
                disabled={isTeamSelectionOpen}
                onClick={() => dispatch(setIsEnablingSubscriptions(true))}
            >
                Enable/Disable subscriptions
            </MenuItem>
        </DropdownMenu>
    );
};
