import React, { Fragment, ReactElement, useState } from "react";
import { Button } from "@skbkontur/react-ui";
import DeleteIcon from "@skbkontur/react-icons/Delete";
import { Grid } from "../Grid/Grid";
import { Confirm } from "./Confirm";
import { Team } from "../../Domain/Team";
import { CollapseButton } from "../CollapseButton/CollapseButton";
import { AddUserToTeam } from "./AddUserToTeam";

interface UsersProps {
    team: Team;
    addUserToTeam: (team: Team, userName: string) => void;
    onRemoveUser: (userName: string) => void;
    getUsers: (team: Team) => Promise<string[]>;
}

export function Users(props: UsersProps): ReactElement {
    const [users, setUsers] = useState<string[]>();
    const [addingUser, setAddingUser] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleCollapse = async () => {
        if (!loading && !users) {
            setLoading(true);
            try {
                setUsers(await props.getUsers(props.team));
            } finally {
                setLoading(false);
            }
        }
    };

    const handleUserSave = async (userName: string) => {
        setAddingUser(false);
        await props.addUserToTeam(props.team, userName);
        setUsers(await props.getUsers(props.team));
    };

    return (
        <CollapseButton title="Show Users" loading={loading} onCollapse={handleCollapse}>
            {users?.length ? (
                <Grid columns="20px 240px" gap="8px" margin="8px 0 0 8px">
                    {users.map((userName) => (
                        <Fragment key={userName}>
                            <Confirm
                                message={`Exclude ${userName} from ${props.team.name}?`}
                                action={() => props.onRemoveUser(userName)}
                            >
                                <Button use={"link"} icon={<DeleteIcon />} />
                            </Confirm>
                            {userName}
                        </Fragment>
                    ))}

                    <div />
                    <Button use={"link"} width={0} onClick={() => setAddingUser(true)}>
                        Add User
                    </Button>
                </Grid>
            ) : (
                <Grid columns={"max-content max-content"} gap="4px" margin="8px 0 0 8px">
                    <div>There are no users:</div>
                    <Button use={"link"} onClick={() => setAddingUser(true)}>
                        Add User
                    </Button>
                </Grid>
            )}

            {addingUser ? (
                <AddUserToTeam
                    team={props.team}
                    onSave={handleUserSave}
                    onClose={() => setAddingUser(false)}
                />
            ) : null}
        </CollapseButton>
    );
}
