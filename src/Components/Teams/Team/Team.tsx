import React, { ReactElement } from "react";
import { Button } from "@skbkontur/react-ui";
import EditIcon from "@skbkontur/react-icons/Edit";
import { Team } from "../../../Domain/Team";
import { TeamEditor } from "../TeamEditor/TeamEditor";
import { Markdown } from "../../Markdown/Markdown";
import { ConfirmFullTeamDeleteion } from "../ConfirmFullTeamDeletion/ConfirmFullTeamDeletion";
import { useModal } from "../../../hooks/useModal";
import classNames from "classnames/bind";

import styles from "./Team.module.less";

const cn = classNames.bind(styles);

interface ITeamProps {
    team: Team;
}

export function Team({ team }: ITeamProps): ReactElement {
    const { isModalOpen, openModal, closeModal } = useModal();

    return (
        <>
            <ConfirmFullTeamDeleteion team={team} />

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
