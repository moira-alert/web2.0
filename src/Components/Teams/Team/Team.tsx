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
    const [isEditing, setIsEditing] = useState(false);

    const handleSave = (team: Team) => {
        setIsEditing(false);
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
                            <Button
                                data-tid={`Delete team ${team.name}`}
                                use={"link"}
                                icon={<DeleteIcon />}
                            />
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
                onClick={() => setIsEditing(true)}
            >
                Edit Team
            </Button>

            {isEditing ? (
                <TeamEditor
                    team={team}
                    onSaveTeam={handleSave}
                    onClose={() => setIsEditing(false)}
                />
            ) : null}
        </>
    );
}
