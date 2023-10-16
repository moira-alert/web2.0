import React from "react";
import { Team } from "../../Domain/Team";
import {
    ValidationContainer,
    ValidationInfo,
    ValidationWrapper,
} from "@skbkontur/react-ui-validations";
import { Button, Gapped, Input, Modal, Textarea } from "@skbkontur/react-ui";
import { Grid } from "../Grid/Grid";
import { isEmptyString } from "../../helpers/isEmptyString";
import { GridCell } from "../Grid/GridCell";

interface TeamEditorProps {
    team?: Team;
    onAddTeam?: (team: Partial<Team>) => void;
    onSaveTeam?: (team: Team) => void;
    onClose: () => void;
}

type TeamEditorState = {
    name: string;
    description: string;
};

export class TeamEditor extends React.Component<TeamEditorProps, TeamEditorState> {
    private validation = React.createRef<ValidationContainer>();
    public state: TeamEditorState = {
        name: this.props.team?.name ?? "",
        description: this.props.team?.description ?? "",
    };

    public render(): React.ReactElement {
        return (
            <ValidationContainer ref={this.validation}>
                <Modal width={600} onClose={this.props.onClose}>
                    <Modal.Header>
                        {this.props.team ? `Edit team ${this.props.team.name} ` : "Add Team"}
                    </Modal.Header>
                    <Modal.Body>
                        <Grid columns="120px 400px" gap="16px">
                            {this.props.team ? null : (
                                <>
                                    Name:
                                    <ValidationWrapper validationInfo={this.validateName()}>
                                        <Input
                                            value={this.state.name}
                                            onValueChange={this.handleNameChange}
                                            width={"100%"}
                                            disabled={Boolean(this.props.team)}
                                        />
                                    </ValidationWrapper>
                                </>
                            )}
                            <GridCell align={"flex-start"} margin="8px 0 0">
                                Description:
                            </GridCell>
                            <Textarea
                                value={this.state.description}
                                onValueChange={this.handleDescriptionChange}
                                width="100%"
                                autoResize
                            />
                        </Grid>
                    </Modal.Body>
                    <Modal.Footer>
                        <Gapped gap={8}>
                            {this.props.team ? (
                                <Button use={"primary"} onClick={this.handleSaveTeam} width={100}>
                                    Save
                                </Button>
                            ) : (
                                <Button use={"primary"} onClick={this.handleAddTeam} width={100}>
                                    Add
                                </Button>
                            )}
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

        this.props.onAddTeam?.({
            name: this.state.name,
            description: this.state.description,
        });
    };

    private handleSaveTeam = async () => {
        const isValid = await this.validation.current?.validate();
        if (!isValid || !this.props.team) {
            return;
        }

        this.props.onSaveTeam?.({
            ...this.props.team,
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
