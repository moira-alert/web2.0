import React, { Fragment, ReactElement, useState } from "react";
import { Button } from "@skbkontur/react-ui";
import AddIcon from "@skbkontur/react-icons/Add";
import DeleteIcon from "@skbkontur/react-icons/Delete";
import { Grid } from "../Grid/Grid";
import { Confirm } from "./Confirm";
import { Team } from "../../Domain/Team";
import { CollapseButton } from "../CollapseButton/CollapseButton";
import { AddUserToTeam } from "./AddUserToTeam";
import { useGetUserQuery } from "../../services/UserApi";
import { useDeleteUserFromTeamMutation, useGetTeamUsersQuery } from "../../services/TeamsApi";
import { useModal } from "../../hooks/useModal";
import { getExcludeYourselfFromTeamMessage } from "../../helpers/getExcludeYourselfFromTeamMessage";

interface UsersProps {
    team: Team;
}

export function Users({ team }: UsersProps): ReactElement {
    const [isCollapsed, setIsCollapsed] = useState(true);
    const { isModalOpen, closeModal, openModal } = useModal();
    const [deleteUserFromTeam, { isLoading: isDeletingUser }] = useDeleteUserFromTeamMutation();
    const {
        data: users,
        isLoading: isGettingUsers,
        isFetching: isFetchingUsers,
    } = useGetTeamUsersQuery(
        { teamId: team.id, handleLoadingLocally: true },
        { skip: isCollapsed }
    );
    const { data: user } = useGetUserQuery();

    const handleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleUserRemove = async (userName: string) => {
        await deleteUserFromTeam({ teamId: team.id, userName, handleLoadingLocally: true });
    };

    return (
        <CollapseButton
            title="Show Users"
            loading={isGettingUsers || isFetchingUsers}
            onCollapse={handleCollapse}
        >
            {users?.length ? (
                <Grid columns="20px 240px" gap="8px" margin="8px 0 0 8px">
                    {users.map((userName) => (
                        <Fragment key={userName}>
                            <Confirm
                                message={getExcludeYourselfFromTeamMessage(
                                    userName,
                                    team.name,
                                    user?.login
                                )}
                                action={() => handleUserRemove(userName)}
                                loading={isDeletingUser}
                            >
                                <Button
                                    data-tid={`Delete user ${userName}`}
                                    use={"link"}
                                    icon={<DeleteIcon />}
                                />
                            </Confirm>
                            {userName || <span />}
                        </Fragment>
                    ))}

                    <div />
                    <Button
                        icon={<AddIcon />}
                        use={"link"}
                        width={0}
                        data-tid="Add user"
                        onClick={openModal}
                    >
                        Add User
                    </Button>
                </Grid>
            ) : (
                <Grid columns={"max-content max-content"} gap="4px" margin="8px 0 0 8px">
                    <div>There are no users:</div>
                    <Button icon={<AddIcon />} use={"link"} onClick={openModal}>
                        Add User
                    </Button>
                </Grid>
            )}

            {isModalOpen && <AddUserToTeam team={team} onClose={closeModal} />}
        </CollapseButton>
    );
}
