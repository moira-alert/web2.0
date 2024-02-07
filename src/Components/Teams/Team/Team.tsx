import React, { ReactElement, useState } from "react";
import { Button, Gapped } from "@skbkontur/react-ui";
import EditIcon from "@skbkontur/react-icons/Edit";
import DeleteIcon from "@skbkontur/react-icons/Delete";
import { Team } from "../../../Domain/Team";
import { TeamEditor } from "../TeamEditor/TeamEditor";
import { Markdown } from "../../Markdown/Markdown";
import { Hovered, HoveredShow } from "../Hovered/Hovered";
import { Confirm } from "../Confirm";
import classNames from "classnames/bind";

import styles from "./Team.less";

const cn = classNames.bind(styles);

interface ITeamProps {
    team: Team;
    updateTeam: (team: Team) => void;
    deleteTeam: (team: Team) => void;
}

export function Team({ team, updateTeam, deleteTeam }: ITeamProps): ReactElement {
    const [edit, setEdit] = useState(false);

    const handleSave = (team: Team) => {
        setEdit(false);
        updateTeam(team);
    };

    return (
        <>
            <Hovered>
                <Gapped gap={8}>
                    <h2>{team.name}</h2>
                    <HoveredShow>
                        <Confirm
                            message={`Do you really want to remove "${team.name}" team?`}
                            action={() => deleteTeam(team)}
                        >
                            <Button use={"link"} icon={<DeleteIcon />} />
                        </Confirm>
                    </HoveredShow>
                </Gapped>
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
                onClick={() => setEdit(true)}
            >
                Edit Team
            </Button>

            {edit ? (
                <TeamEditor team={team} onSaveTeam={handleSave} onClose={() => setEdit(false)} />
            ) : null}
        </>
    );
}
