import React, { ReactElement, useState } from "react";
import { Button } from "@skbkontur/react-ui";
import EditIcon from "@skbkontur/react-icons/Edit";
import { Team } from "../../Domain/Team";
import { Grid } from "../Grid/Grid";
import { Users } from "./Users";
import { TeamEditor } from "./TeamEditor";

interface TeamsProps {
    teams: Team[];
    removeUser: (team: Team, userName: string) => void;
    addUserToTeam: (team: Team, userName: string) => void;
    getUsers: (team: Team) => Promise<string[]>;
    addTeam: (team: Partial<Team>) => void;
    updateTeam: (team: Team) => void;
}

export function Teams(props: TeamsProps): ReactElement {
    const [addingTeam, setAddingTeam] = useState(false);
    const [editingTeam, setEditingTeam] = useState<Team>();

    const handleAddTeam = (team: Partial<Team>) => {
        props.addTeam(team);
        setAddingTeam(false);
    };

    const handleSaveTeam = (team: Team) => {
        props.updateTeam(team);
        setEditingTeam(undefined);
    };

    return (
        <>
            <div>
                {props.teams?.map((team) => {
                    return (
                        <div key={team.id}>
                            <h2>{team.name}</h2>
                            {team.description}{" "}
                            <Button
                                icon={<EditIcon />}
                                use={"link"}
                                onClick={() => setEditingTeam(team)}
                                width="20px"
                            />
                            <Grid gap="4px" margin="8px 0 0">
                                <Users
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
            </div>
            <Grid columns="100px" margin="24px 0">
                <Button onClick={() => setAddingTeam(true)}>Add team</Button>
            </Grid>

            {addingTeam ? (
                <TeamEditor onAddTeam={handleAddTeam} onClose={() => setAddingTeam(false)} />
            ) : null}
            {editingTeam ? (
                <TeamEditor
                    team={editingTeam}
                    onSaveTeam={handleSaveTeam}
                    onClose={() => setEditingTeam(undefined)}
                />
            ) : null}
        </>
    );
}
