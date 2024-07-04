import React, { FC } from "react";
import { Team as TeamComponent } from "./Team/Team";
import { useGetTeamQuery } from "../../services/TeamsApi";
import { Grid } from "../Grid/Grid";
import { Users } from "./Users";
import { Team } from "../../Domain/Team";
import { useParams } from "react-router";

interface ITeamWithUsersProps {
    team?: Team;
}

export const TeamWithUsers: FC<ITeamWithUsersProps> = (props) => {
    const { teamId } = useParams<{ teamId: string }>();
    const { data: teamData } = useGetTeamQuery(teamId, { skip: !teamId });
    const team = props.team || teamData;
    return team ? (
        <>
            <TeamComponent team={team} />
            <Grid gap="4px" margin="8px 0 0">
                <Users team={team} />
            </Grid>
        </>
    ) : null;
};
