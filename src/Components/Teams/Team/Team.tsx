import React, { ReactElement } from "react";
import { Button } from "@skbkontur/react-ui";
import { Flexbox } from "../../Flexbox/FlexBox";
import EditIcon from "@skbkontur/react-icons/Edit";
import DeleteIcon from "@skbkontur/react-icons/Delete";
import { Team } from "../../../Domain/Team";
import { TeamEditor } from "../TeamEditor/TeamEditor";
import { Markdown } from "../../Markdown/Markdown";
import { Hovered, HoveredShow } from "../Hovered/Hovered";
import { Confirm } from "../Confirm";
import { useDeleteTeamMutation } from "../../../services/TeamsApi";
import { useModal } from "../../../hooks/useModal";
import classNames from "classnames/bind";

import styles from "./Team.less";

const cn = classNames.bind(styles);

interface ITeamProps {
    team: Team;
}

export function Team({ team }: ITeamProps): ReactElement {
    const { isModalOpen, openModal, closeModal } = useModal();
    const [deleteTeam, { isLoading: isDeleting }] = useDeleteTeamMutation();

    const handleDeleteTeam = async () => {
        await deleteTeam({ teamId: team.id, handleLoadingLocally: true });
    };

    return (
        <>
            <Hovered>
                <Flexbox align="center" direction="row" gap={8}>
                    <h2>{team.name}</h2>
                    <HoveredShow>
                        <Confirm
                            message={`Do you really want to remove "${team.name}" team?`}
                            action={handleDeleteTeam}
                            loading={isDeleting}
                        >
                            <Button
                                data-tid={`Delete team ${team.name}`}
                                use={"link"}
                                icon={<DeleteIcon />}
                            />
                        </Confirm>
                    </HoveredShow>
                </Flexbox>
            </Hovered>

            {team.description && (
                <div className={cn("wysiwyg", "descriptionContainer")}>
                    <Markdown markdown={team.description} />
                </div>
            )}

            <Button
                className={cn("editDescBtn")}
                icon={<EditIcon />}
                use={"link"}
                onClick={openModal}
            >
                Edit Team
            </Button>

            {isModalOpen ? <TeamEditor team={team} onClose={closeModal} /> : null}
        </>
    );
}
