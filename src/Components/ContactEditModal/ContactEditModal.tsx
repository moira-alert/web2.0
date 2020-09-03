import * as React from "react";
import { Modal } from "@skbkontur/react-ui/components/Modal";
import { Button } from "@skbkontur/react-ui/components/Button";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Fill, RowStack } from "@skbkontur/react-stack-layout";
import { ContactConfig } from "../../Domain/Config";
import { Contact } from "../../Domain/Contact";
import { omitContact } from "../../helpers/omitTypes";
import ContactEditForm from "../ContactEditForm/ContactEditForm";
import FileExport from "../FileExport/FileExport";

type Props = {
    contactDescriptions: Array<ContactConfig>;
    contactInfo: Contact;
    onChange: (contact: Partial<Contact>) => void;
    onCancel: () => void;
    onUpdate: () => Promise<void>;
    onUpdateAndTest: () => Promise<void>;
    onDelete: () => Promise<void>;
};

type State = {
    updateAndTestInProcess: boolean;
    updateInProcess: boolean;
    deleteInProcess: boolean;
};

export default class ContactEditModal extends React.Component<Props, State> {
    public state: State;

    readonly validationContainer: { current: ValidationContainer | null };

    constructor(props: Props) {
        super(props);
        this.state = {
            updateAndTestInProcess: false,
            updateInProcess: false,
            deleteInProcess: false,
        };
        this.validationContainer = React.createRef<ValidationContainer>();
    }

    render(): React.ReactNode {
        const { onChange, onCancel, contactInfo, contactDescriptions } = this.props;
        const { updateAndTestInProcess, updateInProcess, deleteInProcess } = this.state;
        const isActionButtonDisabled = updateAndTestInProcess || updateInProcess || deleteInProcess;

        return (
            <Modal onClose={onCancel} ignoreBackgroundClick>
                <Modal.Header sticky={false}>Delivery channel editing</Modal.Header>
                <Modal.Body>
                    <ValidationContainer ref={this.validationContainer}>
                        <ContactEditForm
                            contactDescriptions={contactDescriptions}
                            contactInfo={contactInfo}
                            onChange={(update) => onChange({ ...contactInfo, ...update })}
                        />
                    </ValidationContainer>
                </Modal.Body>
                <Modal.Footer panel sticky>
                    <RowStack gap={2} block baseline>
                        <Button
                            use="primary"
                            disabled={isActionButtonDisabled}
                            loading={updateInProcess}
                            onClick={this.handleUpdateContact}
                        >
                            Save
                        </Button>
                        <Button
                            loading={updateAndTestInProcess}
                            disabled={isActionButtonDisabled}
                            onClick={this.handleUpdateAndTestContact}
                        >
                            Save and test
                        </Button>
                        <FileExport
                            title={`delivery channel ${contactInfo.type} ${contactInfo.value}`}
                            data={omitContact(contactInfo)}
                        >
                            Export
                        </FileExport>
                        <Fill />
                        <Button
                            use="danger"
                            loading={deleteInProcess}
                            disabled={isActionButtonDisabled}
                            onClick={this.handleDeleteContact}
                        >
                            Delete
                        </Button>
                    </RowStack>
                </Modal.Footer>
            </Modal>
        );
    }

    handleUpdateAndTestContact = async (): Promise<void> => {
        if (!(await this.validateForm())) {
            return;
        }
        const { onUpdateAndTest } = this.props;
        this.setState({ updateAndTestInProcess: true });
        try {
            await onUpdateAndTest();
        } catch (error) {
            this.setState({ updateAndTestInProcess: false });
        }
    };

    handleUpdateContact = async (): Promise<void> => {
        if (!(await this.validateForm())) {
            return;
        }
        const { onUpdate } = this.props;
        this.setState({ updateInProcess: true });
        try {
            await onUpdate();
        } catch (error) {
            this.setState({ updateInProcess: false });
        }
    };

    handleDeleteContact = async (): Promise<void> => {
        const { onDelete } = this.props;
        this.setState({ deleteInProcess: true });
        try {
            await onDelete();
        } catch (error) {
            this.setState({ deleteInProcess: false });
        }
    };

    async validateForm(): Promise<boolean> {
        if (this.validationContainer.current == null) {
            return true;
        }
        return this.validationContainer.current.validate();
    }
}
