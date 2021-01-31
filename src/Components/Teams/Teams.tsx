import React, { Fragment, ReactElement, useState } from "react";
import { Button } from "@skbkontur/react-ui";
import DeleteIcon from "@skbkontur/react-icons/Delete";
import { Team } from "../../Domain/Team";
import { CollapseButton } from "../CollapseButton/CollapseButton";
import { Grid } from "../Grid/Grid";
import { User } from "../../Domain/User";
import { AddUserToTeam } from "./AddUserToTeam";
import { Confirm } from "./Confirm";
import { AddTeam } from "./AddTeam";

interface TeamsProps {
    teams: Team[];
    removeUser: (team: Team, user: User) => void;
    addUser: (team: Team, user: Partial<User>) => void;
    addTeam: (team: Partial<Team>) => void;
}

export function Teams(props: TeamsProps): ReactElement {
    const [selectedTeam, setSelectedTeam] = useState<Team>();
    const [isAddTeam, setIsAddTeam] = useState(false);

    const handleSubmitTeam = (team: Partial<Team>) => {
        props.addTeam(team);
        setIsAddTeam(false);
    };

    const handleSubmitUser = (user: Partial<User>) => {
        if (selectedTeam) {
            props.addUser(selectedTeam, user);
            setSelectedTeam(undefined);
        }
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
                                <CollapseButton title="Show Users">
                                    {team.users.length ? (
                                        <Grid columns="20px 240px" gap="8px" margin="8px 0 0 8px">
                                            {team.users.map((user) => (
                                                <Fragment key={user.id}>
                                                    <Confirm
                                                        message={`Exclude ${user.name} from ${team.name}?`}
                                                        action={() => props.removeUser(team, user)}
                                                    >
                                                        <Button
                                                            use={"link"}
                                                            icon={<DeleteIcon />}
                                                        />
                                                    </Confirm>
                                                    {user.name}
                                                </Fragment>
                                            ))}

                                            <div />
                                            <Button
                                                use={"link"}
                                                width={0}
                                                onClick={() => setSelectedTeam(team)}
                                            >
                                                Add User
                                            </Button>
                                        </Grid>
                                    ) : (
                                        <Grid
                                            columns={"max-content max-content"}
                                            gap="4px"
                                            margin="8px 0 0 8px"
                                        >
                                            <div>There are no users:</div>
                                            <Button
                                                use={"link"}
                                                onClick={() => setSelectedTeam(team)}
                                            >
                                                Add User
                                            </Button>
                                        </Grid>
                                    )}
                                </CollapseButton>
                            </Grid>
                        </div>
                    );
                })}
            </div>
            <Grid columns="100px" margin="24px 0">
                <Button onClick={() => setIsAddTeam(true)}>Add team</Button>
            </Grid>
            {selectedTeam ? (
                <AddUserToTeam
                    team={selectedTeam}
                    onAddUser={handleSubmitUser}
                    onClose={() => setSelectedTeam(undefined)}
                />
            ) : null}
            {isAddTeam ? (
                <AddTeam onAddTeam={handleSubmitTeam} onClose={() => setIsAddTeam(false)} />
            ) : null}
        </>
    );
}
