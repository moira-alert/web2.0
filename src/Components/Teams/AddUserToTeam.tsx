import React, { ReactElement, useRef, useState } from "react";
import { Button, Gapped, Input, Modal } from "@skbkontur/react-ui";
import { Grid } from "../Grid/Grid";
import {
    ValidationContainer,
    ValidationInfo,
    ValidationWrapper,
} from "@skbkontur/react-ui-validations";
import { isEmptyString } from "../HighlightInput/parser/parseExpression";
import { Team } from "../../Domain/Team";
import { User } from "../../Domain/User";

interface AddUserProps {
    team: Team;
    onSaveUser: (user: Partial<User>) => void;
    onClose: () => void;
}

export function AddUserToTeam(props: AddUserProps): ReactElement {
    const [name, setName] = useState("");
    const validation = useRef<ValidationContainer>(null);
    const nameValidate: ValidationInfo | undefined = isEmptyString(name)
        ? {
              type: "submit",
              message: "Can't be empty",
          }
        : undefined;

    const handleAdd = async () => {
        const isValid = await validation.current?.validate();
        if (!isValid) {
            return;
        }
        props.onSaveUser({ name: name });
    };

    return (
        <ValidationContainer ref={validation}>
            <Modal noClose>
                <Modal.Header>Add User to {props.team.name}</Modal.Header>
                <Modal.Body>
                    <Grid columns="60px 300px" gap="16px">
                        Name:
                        <ValidationWrapper validationInfo={nameValidate}>
                            <Input value={name} onValueChange={setName} width={"100%"} />
                        </ValidationWrapper>
                    </Grid>
                </Modal.Body>
                <Modal.Footer>
                    <Gapped gap={8}>
                        <Button use={"primary"} onClick={handleAdd} width={100}>
                            Add User
                        </Button>
                        <Button onClick={props.onClose}>Cancel</Button>
                    </Gapped>
                </Modal.Footer>
            </Modal>
        </ValidationContainer>
    );
}
