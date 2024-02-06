import React, { ReactElement, useState } from "react";
import { Button } from "@skbkontur/react-ui";
import { Team } from "../../Domain/Team";
import { Grid } from "../Grid/Grid";
import { Users } from "./Users";
import { TeamEditor } from "./TeamEditor/TeamEditor";
import { TeamComponent } from "./TeamComponent/TeamComponent";

interface TeamsProps {
    login?: string;
    teams: Team[];
    removeUser: (team: Team, userName: string) => void;
    addUserToTeam: (team: Team, userName: string) => void;
    getUsers: (team: Team) => Promise<string[]>;
    addTeam: (team: Partial<Team>) => void;
    updateTeam: (team: Team) => void;
    deleteTeam: (team: Team) => void;
}

export function Teams(props: TeamsProps): ReactElement {
    const [addingTeam, setAddingTeam] = useState(false);

    const handleAddTeam = (team: Partial<Team>) => {
        props.addTeam(team);
        setAddingTeam(false);
    };

    return (
        <>
            {props.teams?.map((team) => {
                return (
                    <div key={team.id}>
                        <TeamComponent
                            deleteTeam={props.deleteTeam}
                            team={team}
                            updateTeam={props.updateTeam}
                        />
                        <Grid gap="4px" margin="8px 0 0">
                            <Users
                                login={props.login}
                                team={team}
                                getUsers={props.getUsers}
                                onRemoveUser={(userName: string) =>
                                    props.removeUser(team, userName)
                                }
                                addUserToTeam={props.addUserToTeam}
                            />
                        </Grid>
                    </div>
                );
            })}
            <Grid columns="100px" margin="24px 0">
                <Button onClick={() => setAddingTeam(true)}>Add team</Button>
            </Grid>

            {addingTeam ? (
                <TeamEditor onAddTeam={handleAddTeam} onClose={() => setAddingTeam(false)} />
            ) : null}
        </>
    );
}
