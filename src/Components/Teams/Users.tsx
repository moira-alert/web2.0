import React, { Fragment, ReactElement, useState } from "react";
import { Button } from "@skbkontur/react-ui";
import AddIcon from "@skbkontur/react-icons/Add";
import DeleteIcon from "@skbkontur/react-icons/Delete";
import { Grid } from "../Grid/Grid";
import { Confirm } from "./Confirm";
import { Team } from "../../Domain/Team";
import { CollapseButton } from "../CollapseButton/CollapseButton";
import { AddUserToTeam } from "./AddUserToTeam";

interface UsersProps {
    login?: string;
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

    const handleUserRemove = async (userName: string) => {
        setAddingUser(false);
        await props.onRemoveUser(userName);
        setUsers(await props.getUsers(props.team));
    };

    const getExcludeMessage = (userName: string) => {
        if (userName === props.login) {
            return `You are trying to exclude yourself from the "${props.team.name}". If you do this, you will no longer be able to see this team. Are you sure you want to exclude yourself?`;
        }
        return `Exclude "${userName}" from "${props.team.name}"?`;
    };

    return (
        <CollapseButton title="Show Users" loading={loading} onCollapse={handleCollapse}>
            {users?.length ? (
                <Grid columns="20px 240px" gap="8px" margin="8px 0 0 8px">
                    {users.map((userName) => (
                        <Fragment key={userName}>
                            <Confirm
                                message={getExcludeMessage(userName)}
                                action={() => handleUserRemove(userName)}
                            >
                                <Button use={"link"} icon={<DeleteIcon />} />
                            </Confirm>
                            {userName || <span />}
                        </Fragment>
                    ))}

                    <div />
                    <Button
                        icon={<AddIcon />}
                        use={"link"}
                        width={0}
                        onClick={() => setAddingUser(true)}
                    >
                        Add User
                    </Button>
                </Grid>
            ) : (
                <Grid columns={"max-content max-content"} gap="4px" margin="8px 0 0 8px">
                    <div>There are no users:</div>
                    <Button icon={<AddIcon />} use={"link"} onClick={() => setAddingUser(true)}>
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
