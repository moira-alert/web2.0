import { Team } from "../../../Domain/Team";
import React, { useState, useRef, FC } from "react";
import {
    ValidationContainer,
    ValidationInfo,
    ValidationWrapper,
} from "@skbkontur/react-ui-validations";
import { Button, Gapped, Input, Modal, Textarea } from "@skbkontur/react-ui";
import { Grid } from "../../Grid/Grid";
import { isEmptyString } from "../../../helpers/isEmptyString";
import { GridCell } from "../../Grid/GridCell";
import { Markdown } from "../../Markdown/Markdown";
import { useEditPreviewTabs } from "../../../hooks/useEditPreviewTabs/useEditPreviewTabs";
import classNames from "classnames/bind";

import styles from "./TeamEditor.less";

const cn = classNames.bind(styles);

interface ITeamEditorProps {
    team?: Team;
    onAddTeam?: (team: Partial<Team>) => void;
    onSaveTeam?: (team: Team) => void;
    onClose: () => void;
}

export const TeamEditor: FC<ITeamEditorProps> = ({
    team,
    onAddTeam,
    onSaveTeam,
    onClose,
}: ITeamEditorProps) => {
    const validationRef = useRef<ValidationContainer>(null);
    const [name, setName] = useState<string>(team?.name || "");
    const [description, setDescription] = useState<string>(team?.description || "");
    const { descriptionView, EditPreviewComponent } = useEditPreviewTabs();

    const validateName = (): ValidationInfo | undefined => {
        return isEmptyString(name)
            ? {
                  type: "submit",
                  message: "Can't be empty",
              }
            : undefined;
    };

    const handleAddTeam = async () => {
        const isValid = await validationRef.current?.validate();
        if (!isValid) {
            return;
        }

        onAddTeam?.({
            name: name,
            description: description,
        });
    };

    const handleSaveTeam = async () => {
        const isValid = await validationRef.current?.validate();
        if (!isValid || !team) {
            return;
        }

        onSaveTeam?.({
            ...team,
            description: description,
            name: name,
        });
    };

    return (
        <ValidationContainer ref={validationRef}>
            <Modal width={600} onClose={onClose}>
                <Modal.Header>{team ? `Edit team ${team.name} ` : "Add Team"}</Modal.Header>
                <Modal.Body>
                    <EditPreviewComponent />
                    <Grid columns="120px 400px" gap="16px">
                        Name:
                        <ValidationWrapper validationInfo={validateName()}>
                            <Input
                                data-tid="Team name"
                                value={name}
                                onValueChange={setName}
                                width={"100%"}
                            />
                        </ValidationWrapper>
                        <GridCell align={"flex-start"} margin="8px 0 0">
                            Description:
                        </GridCell>
                        {descriptionView === "edit" ? (
                            <Textarea
                                data-tid="Team description"
                                value={description}
                                onValueChange={setDescription}
                                width="100%"
                                autoResize
                            />
                        ) : (
                            <Markdown
                                markdown={description}
                                className={cn("wysiwyg", "description-preview")}
                            />
                        )}
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    <Gapped gap={8}>
                        {team ? (
                            <Button
                                data-tid="Save team"
                                use={"primary"}
                                onClick={handleSaveTeam}
                                width={100}
                            >
                                Save
                            </Button>
                        ) : (
                            <Button
                                data-tid="Confirm add team"
                                use={"primary"}
                                onClick={handleAddTeam}
                                width={100}
                            >
                                Add
                            </Button>
                        )}
                        <Button onClick={onClose}>Cancel</Button>
                    </Gapped>
                </Modal.Footer>
            </Modal>
        </ValidationContainer>
    );
};
