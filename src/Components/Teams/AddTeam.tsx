import * as React from "react";
import { Button, Gapped, Input, Modal, Textarea } from "@skbkontur/react-ui";
import {
    ValidationContainer,
    ValidationInfo,
    ValidationWrapper,
} from "@skbkontur/react-ui-validations";
import { Grid } from "../Grid/Grid";
import { isEmptyString } from "../HighlightInput/parser/parseExpression";
import { Team } from "../../Domain/Team";

interface AddTeamProps {
    onAddTeam: (team: Partial<Team>) => void;
    onClose: () => void;
}

type State = {
    name: string;
    description: string;
};

export class AddTeam extends React.Component<AddTeamProps, State> {
    private validation = React.createRef<ValidationContainer>();
    public state: State = {
        name: "",
        description: "",
    };

    public render(): React.ReactElement {
        return (
            <ValidationContainer ref={this.validation}>
                <Modal width={600} noClose>
                    <Modal.Header>Add New Team</Modal.Header>
                    <Modal.Body>
                        <Grid columns="120px 400px" gap="16px">
                            Name:
                            <ValidationWrapper validationInfo={this.validateName()}>
                                <Input
                                    value={this.state.name}
                                    onValueChange={this.handleNameChange}
                                    width={"100%"}
                                />
                            </ValidationWrapper>
                            Description:
                            <Textarea
                                value={this.state.description}
                                onValueChange={this.handleDescriptionChange}
                                width="100%"
                            />
                        </Grid>
                    </Modal.Body>
                    <Modal.Footer>
                        <Gapped gap={8}>
                            <Button use={"primary"} onClick={this.handleAddTeam} width={120}>
                                Add Team
                            </Button>
                            <Button onClick={this.props.onClose}>Cancel</Button>
                        </Gapped>
                    </Modal.Footer>
                </Modal>
            </ValidationContainer>
        );
    }

    private handleNameChange = (name: string) => {
        this.setState({ name: name });
    };
    private handleDescriptionChange = (description: string) => {
        this.setState({ description: description });
    };

    private handleAddTeam = async () => {
        const isValid = await this.validation.current?.validate();
        if (!isValid) {
            return;
        }

        this.props.onAddTeam({
            name: this.state.name,
            description: this.state.description,
        });
    };

    private validateName = (): ValidationInfo | undefined => {
        return isEmptyString(this.state.name)
            ? {
                  type: "submit",
                  message: "Can't be empty",
              }
            : undefined;
    };
}
