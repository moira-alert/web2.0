import React, { FC, useState } from "react";
import { Button } from "@skbkontur/react-ui";
import { Flexbox } from "../../Flexbox/FlexBox";
import { Hovered, HoveredShow } from "../Hovered/Hovered";
import { Team } from "../../../Domain/Team";
import { Confirm } from "../Confirm";
import DeleteIcon from "@skbkontur/react-icons/Delete";
import { useFyllyDeleteTeam } from "../../../hooks/useFullyDeleteTeam";
import { fullyDeleteTeamConfirmText } from "../../../helpers/teamOperationsConfirmMessages";

interface IConfirmFullTeamDeleteionProps {
    team: Team;
}

export const ConfirmFullTeamDeleteion: FC<IConfirmFullTeamDeleteionProps> = ({
    team,
}: IConfirmFullTeamDeleteionProps) => {
    const { id: teamId, name: teamName } = team;
    const [isConfirmOpened, setIsConfirmOpened] = useState<boolean>(false);

    const {
        handleFullyDeleteTeam,
        isFetchingData,
        isDeletingContacts,
        isDeletingSubscriptions,
        isDeletingUsers,
        isDeletingTeam,
    } = useFyllyDeleteTeam(teamId, !isConfirmOpened);

    const confirmMessage = fullyDeleteTeamConfirmText(
        isFetchingData,
        isDeletingContacts,
        isDeletingSubscriptions,
        isDeletingUsers,
        isDeletingTeam,
        teamName
    );

    const isLoading =
        isFetchingData ||
        isDeletingContacts ||
        isDeletingSubscriptions ||
        isDeletingUsers ||
        isDeletingTeam;

    return (
        <Hovered>
            <Flexbox align="baseline" direction="row" gap={8}>
                <h2>{teamName}</h2>
                <HoveredShow>
                    <Confirm
                        isLoading={isLoading}
                        message={confirmMessage}
                        action={handleFullyDeleteTeam}
                        errorMessage="An error occurred during full team deletion."
                    >
                        <Button
                            data-tid={`Delete team ${teamName}`}
                            use={"link"}
                            icon={<DeleteIcon />}
                            onClick={() => setIsConfirmOpened(true)}
                        />
                    </Confirm>
                </HoveredShow>
            </Flexbox>
        </Hovered>
    );
};
