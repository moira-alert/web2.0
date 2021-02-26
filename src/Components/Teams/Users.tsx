import React, { Fragment, ReactElement, useState } from "react";
import { Grid } from "../Grid/Grid";
import { Confirm } from "./Confirm";
import { Button } from "@skbkontur/react-ui";
import DeleteIcon from "@skbkontur/react-icons/Delete";
import { User } from "../../Domain/User";
import { Team } from "../../Domain/Team";
import { CollapseButton } from "../CollapseButton/CollapseButton";
import { AddUserToTeam } from "./AddUserToTeam";

interface UsersProps {
    team: Team;
    addUserToTeam: (team: Team, user: Partial<User>) => void;
    onRemoveUser: (user: User) => void;
    getUsers: (team: Team) => Promise<User[]>;
}

export function Users(props: UsersProps): ReactElement {
    const [users, setUsers] = useState<User[]>();
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

    const handleSaveUser = async (user: Partial<User>) => {
        setAddingUser(false);
        await props.addUserToTeam(props.team, user);
        setUsers(await props.getUsers(props.team));
    };

    return (
        <CollapseButton title="Show Users" loading={loading} onCollapse={handleCollapse}>
            {users?.length ? (
                <Grid columns="20px 240px" gap="8px" margin="8px 0 0 8px">
                    {users.map((user) => (
                        <Fragment key={user.id}>
                            <Confirm
                                message={`Exclude ${user.name} from ${props.team.name}?`}
                                action={() => props.onRemoveUser(user)}
                            >
                                <Button use={"link"} icon={<DeleteIcon />} />
                            </Confirm>
                            {user.name}
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
                    onSaveUser={handleSaveUser}
                    onClose={() => setAddingUser(false)}
                />
            ) : null}
        </CollapseButton>
    );
}
