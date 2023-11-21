import React, { ReactElement, useState } from "react";
import { Button } from "@skbkontur/react-ui";
import EditIcon from "@skbkontur/react-icons/Edit";
import AddIcon from "@skbkontur/react-icons/Add";
import { Team } from "../../../Domain/Team";
import { TeamEditor } from "../TeamEditor/TeamEditor";
import { Markdown } from "../../Markdown/Markdown";
import classNames from "classnames/bind";

import styles from "./TeamDescription.less";

const cn = classNames.bind(styles);

interface TeamDescriptionProps {
    team: Team;
    updateTeam: (team: Team) => void;
}

export function TeamDescription(props: TeamDescriptionProps): ReactElement {
    const [edit, setEdit] = useState(false);

    const handleSave = (team: Team) => {
        setEdit(false);
        props.updateTeam(team);
    };

    const description = props.team.description ? (
        <>
            <div className={cn("wysiwyg", "descriptionContainer")}>
                <Markdown markdown={props.team.description} />
            </div>
            <Button
                className={cn("editDescBtn")}
                icon={<EditIcon />}
                use={"link"}
                onClick={() => setEdit(true)}
            >
                Edit Description
            </Button>
        </>
    ) : (
        <Button icon={<AddIcon />} use={"link"} onClick={() => setEdit(true)}>
            Add description
        </Button>
    );

    return (
        <>
            {description}
            {edit ? (
                <TeamEditor
                    team={props.team}
                    onSaveTeam={handleSave}
                    onClose={() => setEdit(false)}
                />
            ) : null}
        </>
    );
}
