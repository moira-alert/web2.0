import React from "react";
import { DropdownMenu, MenuHeader, MenuSeparator } from "@skbkontur/react-ui";
import { Checkbox } from "@skbkontur/react-ui/components/Checkbox";
import { Team } from "../../Domain/Team";
import { useParams } from "react-router";
import { Button } from "@skbkontur/react-ui/components/Button";
import { useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";
import classNames from "classnames/bind";

import styles from "./TransferSubscriptionsTeamSelect.less";

const cn = classNames.bind(styles);

interface ITransferSubscriptionsTeamSelectProps {
    teams: Team[];
    teamToTransfer: Team | null;
    handleSetTeamToTransfer: (team: Team) => void;
}

export const TransferSubscriptionsTeamSelect: React.FC<ITransferSubscriptionsTeamSelectProps> = ({
    teams,
    teamToTransfer,
    handleSetTeamToTransfer,
}) => {
    const { teamId: currentTeamId } = useParams<{ teamId: string }>();
    const { isTransferringSubscriptions } = useAppSelector(UIState);

    return (
        <DropdownMenu
            caption={({ openMenu }) => (
                <Button width={180} className={cn("transfer-btn")} onClick={() => openMenu()}>
                    {teamToTransfer && isTransferringSubscriptions
                        ? `Transfering to: ${teamToTransfer.name}`
                        : "Transfer subscriptions"}
                </Button>
            )}
        >
            <MenuHeader>Select the team to transfer subscriptions to</MenuHeader>
            <MenuSeparator />
            {teams.map((team) => {
                return (
                    team.id !== currentTeamId && (
                        <div className={cn("dropdown-checkbox-item")}>
                            <Checkbox
                                className={cn("dropdown-checkbox")}
                                checked={teamToTransfer?.id === team.id}
                                onValueChange={() => handleSetTeamToTransfer(team)}
                            >
                                {team.name}
                            </Checkbox>
                        </div>
                    )
                );
            })}
        </DropdownMenu>
    );
};
