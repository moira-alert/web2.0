import React, { ReactElement, useState } from "react";
import { Button } from "@skbkontur/react-ui";
import { Team } from "../../Domain/Team";
import { Grid } from "../Grid/Grid";
import { User } from "../../Domain/User";
import { AddTeam } from "./AddTeam";
import { Users } from "./Users";

interface TeamsProps {
    teams: Team[];
    removeUser: (team: Team, user: User) => void;
    addUserToTeam: (team: Team, user: Partial<User>) => void;
    getUsers: (team: Team) => Promise<User[]>;
    addTeam: (team: Partial<Team>) => void;
}

export function Teams(props: TeamsProps): ReactElement {
    const [isAddTeam, setIsAddTeam] = useState(false);

    const handleSubmitTeam = (team: Partial<Team>) => {
        props.addTeam(team);
        setIsAddTeam(false);
    };

    return (
        <>
            <div>
                {props.teams?.map((team) => {
                    return (
                        <div key={team.id}>
                            <h2>{team.name}</h2>
                            <Grid gap="4px">
                                {team.description}
                                <Users
                                    team={team}
                                    getUsers={props.getUsers}
                                    onRemoveUser={(user: User) => props.removeUser(team, user)}
                                    addUserToTeam={props.addUserToTeam}
                                />
                            </Grid>
                        </div>
                    );
                })}
            </div>
            <Grid columns="100px" margin="24px 0">
                <Button onClick={() => setIsAddTeam(true)}>Add team</Button>
            </Grid>

            {isAddTeam ? (
                <AddTeam onAddTeam={handleSubmitTeam} onClose={() => setIsAddTeam(false)} />
            ) : null}
        </>
    );
}
