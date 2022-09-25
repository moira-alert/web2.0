import React, { ReactElement, useState } from "react";
import { Button, Gapped } from "@skbkontur/react-ui";
import DeleteIcon from "@skbkontur/react-icons/Delete";
import { Team } from "../../Domain/Team";
import { Grid } from "../Grid/Grid";
import { Users } from "./Users";
import { TeamEditor } from "./TeamEditor";
import { Confirm } from "./Confirm";
import { TeamDescription } from "./TeamDescription";
import { Hovered, HoveredShow } from "./Hovered/Hovered";

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
                        <Hovered>
                            <Gapped gap={8}>
                                <h2>{team.name}</h2>
                                <HoveredShow>
                                    <Confirm
                                        message={`Do you really want to remove "${team.name}" team?`}
                                        action={() => props.deleteTeam(team)}
                                    >
                                        <Button
                                            use={"link"}
                                            icon={<DeleteIcon />}
                                            data-tid="delete_team"
                                        />
                                    </Confirm>
                                </HoveredShow>
                            </Gapped>
                        </Hovered>
                        <TeamDescription team={team} updateTeam={props.updateTeam} />
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
