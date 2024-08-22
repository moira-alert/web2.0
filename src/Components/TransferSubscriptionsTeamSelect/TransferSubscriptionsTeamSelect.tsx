import React from "react";
import { DropdownMenu, MenuHeader, MenuSeparator } from "@skbkontur/react-ui";
import { Checkbox } from "@skbkontur/react-ui/components/Checkbox";
import { Team } from "../../Domain/Team";
import { MenuItem } from "@skbkontur/react-ui/components/MenuItem";
import { ThemeContext, ThemeFactory } from "@skbkontur/react-ui";
import { useParams } from "react-router";
import { Button } from "@skbkontur/react-ui/components/Button";
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

    return (
        <DropdownMenu
            caption={({ openMenu }) => (
                <Button width={180} className={cn("transfer-btn")} onClick={() => openMenu()}>
                    {teamToTransfer
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
                        <ThemeContext.Provider
                            key={team.id}
                            value={ThemeFactory.create({
                                menuItemHoverBg: "initial",
                            })}
                        >
                            <MenuItem>
                                <Checkbox
                                    style={{
                                        alignItems: "center",
                                        padding: "0",
                                    }}
                                    checked={teamToTransfer?.id === team.id}
                                    onValueChange={() => handleSetTeamToTransfer(team)}
                                >
                                    {team.name}
                                </Checkbox>
                            </MenuItem>
                        </ThemeContext.Provider>
                    )
                );
            })}
        </DropdownMenu>
    );
};
