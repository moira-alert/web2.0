import React, { ReactElement, useState } from "react";
import { Button } from "@skbkontur/react-ui";
import EditIcon from "@skbkontur/react-icons/Edit";
import AddIcon from "@skbkontur/react-icons/Add";
import { Team } from "../../../Domain/Team";
import { TeamEditor } from "../TeamEditor";
import { Hovered, HoveredShow } from "../Hovered/Hovered";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { purifyConfig } from "../../../Domain/DOMPurify";
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
        <Hovered>
            <div className={cn("descriptionContainer")}>
                <ReactMarkdown disallowedElements={purifyConfig}>
                    {props.team.description}
                </ReactMarkdown>
                &nbsp;
                <HoveredShow>
                    <Button
                        icon={<EditIcon />}
                        use={"link"}
                        onClick={() => setEdit(true)}
                        width="20px"
                    />
                </HoveredShow>
            </div>
        </Hovered>
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
