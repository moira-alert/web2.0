import React, { ReactElement, useRef, useState } from "react";
import { Button, Input, Modal } from "@skbkontur/react-ui";
import { Grid } from "../Grid/Grid";
import { ValidationContainer, ValidationWrapper } from "@skbkontur/react-ui-validations";
import { Team } from "../../Domain/Team";
import ModalError from "../ModalError/ModalError";
import { useAddUserToTeam } from "../../hooks/useAddUserToTeam";
import { validateRequiredString } from "../TriggerEditForm/Validations/validations";
import { Flexbox } from "../Flexbox/FlexBox";

interface AddUserProps {
    team: Team;
    onClose: () => void;
}

export function AddUserToTeam({ team, onClose }: AddUserProps): ReactElement {
    const [userName, setUserName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const validationContainerRef = useRef<ValidationContainer>(null);

    const { handleAddUserToTeam, isAddingUser } = useAddUserToTeam(
        validationContainerRef,
        userName,
        onClose,
        setError,
        team.id
    );

    return (
        <ValidationContainer ref={validationContainerRef}>
            <Modal onClose={onClose}>
                <Modal.Header>Add User to {team.name}</Modal.Header>
                <Modal.Body>
                    <Grid columns="60px 300px" gap="16px">
                        Name:
                        <ValidationWrapper validationInfo={validateRequiredString(userName)}>
                            <Input
                                data-tid="User name"
                                value={userName}
                                onValueChange={setUserName}
                                width={"100%"}
                            />
                        </ValidationWrapper>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    <ModalError message={error as string} maxWidth="376px" />
                    <Flexbox direction="row" gap={8}>
                        <Button
                            data-tid="Add user modal"
                            use={"primary"}
                            onClick={handleAddUserToTeam}
                            width={100}
                            loading={isAddingUser}
                        >
                            Add User
                        </Button>
                        <Button onClick={onClose}>Cancel</Button>
                    </Flexbox>
                </Modal.Footer>
            </Modal>
        </ValidationContainer>
    );
}
