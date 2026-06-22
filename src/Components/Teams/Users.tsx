import { Fragment, ReactElement, useState } from "react";
import { Button } from "@skbkontur/react-ui";
import { IconPlusRegular16 } from "@skbkontur/icons/IconPlusRegular16";
import { IconXRegular16 } from "@skbkontur/icons/IconXRegular16";
import { Grid } from "../Grid/Grid";
import { Confirm } from "./Confirm";
import { Team } from "../../Domain/Team";
import { CollapseButton } from "../CollapseButton/CollapseButton";
import { AddUserToTeam } from "./AddUserToTeam";
import { useGetUserQuery } from "../../services/UserApi";
import { useDeleteUserFromTeamMutation, useGetTeamUsersQuery } from "../../services/TeamsApi";
import { useModal } from "../../hooks/useModal";
import { getExcludeYourselfFromTeamMessage } from "../../helpers/teamOperationsConfirmMessages";

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
        await deleteUserFromTeam({
            teamId: team.id,
            userName,
            handleLoadingLocally: true,
            handleErrorLocally: true,
            tagsToInvalidate: ["TeamUsers"],
        }).unwrap();
    };

    return (
        <CollapseButton
            title="Show Users"
            loading={isGettingUsers || isFetchingUsers}
            onCollapse={handleCollapse}
        >
            {users?.length ? (
                <Grid columns="34px 110px" gap="8px" margin="8px 0 0 8px" align="baseline">
                    {users.map((userName) => (
                        <Fragment key={userName}>
                            <Confirm
                                errorMessage="An error occured during user deletion."
                                message={getExcludeYourselfFromTeamMessage(
                                    userName,
                                    team.name,
                                    user?.login
                                )}
                                action={() => handleUserRemove(userName)}
                                isLoading={isDeletingUser}
                            >
                                <Button
                                    data-tid={`Delete user ${userName}`}
                                    use="text"
                                    icon={<IconXRegular16 />}
                                />
                            </Confirm>
                            {userName || <span />}
                        </Fragment>
                    ))}

                    <div />
                    <Button
                        icon={<IconPlusRegular16 />}
                        use="text"
                        data-tid="Add user"
                        onClick={openModal}
                    >
                        Add User
                    </Button>
                </Grid>
            ) : (
                <Grid columns={"max-content max-content"} gap="4px" margin="8px 0 0 8px">
                    <div>There are no users:</div>
                    <Button icon={<IconPlusRegular16 />} use="text" onClick={openModal}>
                        Add User
                    </Button>
                </Grid>
            )}
            {isModalOpen && <AddUserToTeam team={team} onClose={closeModal} />}
        </CollapseButton>
    );
}
