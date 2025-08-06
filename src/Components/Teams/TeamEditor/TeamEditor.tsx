import { Team } from "../../../Domain/Team";
import React, { useState, useRef, FC } from "react";
import { ValidationContainer, ValidationWrapper } from "@skbkontur/react-ui-validations";
import { Button, Input, Modal } from "@skbkontur/react-ui";
import { Grid } from "../../Grid/Grid";
import { Flexbox } from "../../Flexbox/FlexBox";
import { GridCell } from "../../Grid/GridCell";
import ModalError from "../../ModalError/ModalError";
import { validateRequiredString } from "../../TriggerEditForm/Validations/validations";
import { useUpdateTeam } from "../../../hooks/useUpdateTeam";
import { useAddTeam } from "../../../hooks/useAddTeam";
import { Markdown } from "@skbkontur/markdown";
import { WysiwygWrapper } from "../../Markdown/WysiwygWrapper";

interface ITeamEditorProps {
    team?: Team | null;
    onClose: () => void;
}

export const TeamEditor: FC<ITeamEditorProps> = ({ team, onClose }: ITeamEditorProps) => {
    const validationRef = useRef<ValidationContainer>(null);
    const [name, setName] = useState<string>(team?.name || "");
    const [description, setDescription] = useState<string>(team?.description || "");
    const [error, setError] = useState<string | null>(null);
    const { handleUpdateTeam, isUpdatingTeam } = useUpdateTeam(
        validationRef,
        name,
        description,
        setError,
        onClose,
        team
    );
    const { handleAddTeam, isAddingTeam } = useAddTeam(
        validationRef,
        name,
        description,
        setError,
        onClose
    );

    return (
        <ValidationContainer ref={validationRef}>
            <Modal width={600} onClose={onClose}>
                <Modal.Header>{team ? `Edit team ${team.name} ` : "Add Team"}</Modal.Header>
                <Modal.Body>
                    <Grid columns="120px 400px" gap="16px">
                        Name:
                        <ValidationWrapper validationInfo={validateRequiredString(name)}>
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
                        <WysiwygWrapper>
                            <Markdown
                                data-tid="Team description"
                                showActionHints={false}
                                value={description}
                                onValueChange={setDescription}
                            />
                        </WysiwygWrapper>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    <ModalError message={error} maxWidth="532px" />
                    <Flexbox direction="row" gap={8}>
                        {team ? (
                            <Button
                                data-tid="Save team"
                                use={"primary"}
                                onClick={handleUpdateTeam}
                                width={100}
                                loading={isUpdatingTeam}
                                disabled={isUpdatingTeam || isAddingTeam}
                            >
                                Save
                            </Button>
                        ) : (
                            <Button
                                data-tid="Confirm add team"
                                use={"primary"}
                                onClick={handleAddTeam}
                                width={100}
                                loading={isAddingTeam}
                                disabled={isUpdatingTeam || isAddingTeam}
                            >
                                Add
                            </Button>
                        )}
                        <Button onClick={onClose}>Cancel</Button>
                    </Flexbox>
                </Modal.Footer>
            </Modal>
        </ValidationContainer>
    );
};
