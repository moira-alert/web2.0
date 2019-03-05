// @flow
import * as React from "react";
import Modal from "retail-ui/components/Modal";
import Gapped from "retail-ui/components/Gapped";
import Button from "retail-ui/components/Button";
import { ValidationContainer } from "react-ui-validations";
import type { ContactConfig } from "../../Domain/Config";
import ContactEditForm from "../ContactEditForm/ContactEditForm";
import type { Contact } from "../../Domain/Contact";

type Props = {|
    contactDescriptions: Array<ContactConfig>,
    contactInfo: Contact,
    onChange: ($Shape<Contact>) => void,
    onCancel: () => void,
    onUpdate: () => Promise<void>,
    onUpdateAndTest: () => Promise<void>,
    onDelete: () => Promise<void>,
|};

type State = {
    updateAndTestInProcess: boolean,
    updateInProcess: boolean,
    deleteInProcess: boolean,
};

export default class ContactEditModal extends React.Component<Props, State> {
    state: State;

    validationContainer: { current: ValidationContainer | null };

    constructor(props: Props) {
        super(props);
        this.state = {
            updateAndTestInProcess: false,
            updateInProcess: false,
            deleteInProcess: false,
        };
        this.validationContainer = React.createRef<ValidationContainer>();
    }

    render(): React.Node {
        const { onChange, onCancel, contactInfo, contactDescriptions } = this.props;
        const { updateAndTestInProcess, updateInProcess, deleteInProcess } = this.state;
        const isActionButtonDisabled = updateAndTestInProcess || updateInProcess || deleteInProcess;

        return (
            <Modal onClose={onCancel} ignoreBackgroundClick>
                <Modal.Header sticky={false}>Edit delivery channel</Modal.Header>
                <Modal.Body>
                    <ValidationContainer ref={this.validationContainer}>
                        <ContactEditForm
                            contactDescriptions={contactDescriptions}
                            contactInfo={{ type: contactInfo.type, value: contactInfo.value }}
                            onChange={update => onChange({ ...contactInfo, ...update })}
                        />
                    </ValidationContainer>
                </Modal.Body>
                <Modal.Footer panel sticky>
                    <Gapped gap={10}>
                        <Button
                            loading={updateAndTestInProcess}
                            use="primary"
                            disabled={isActionButtonDisabled}
                            onClick={() => {
                                this.handleUpdateAndTestContact();
                            }}
                        >
                            Update and test channel
                        </Button>
                        <Button
                            disabled={isActionButtonDisabled}
                            loading={updateInProcess}
                            onClick={() => {
                                this.handleUpdateContact();
                            }}
                        >
                            Update channel
                        </Button>
                        <Button
                            use="danger"
                            loading={deleteInProcess}
                            disabled={isActionButtonDisabled}
                            onClick={() => {
                                this.handleDeleteContact();
                            }}
                        >
                            Delete channel
                        </Button>
                    </Gapped>
                </Modal.Footer>
            </Modal>
        );
    }

    handleUpdateAndTestContact = async () => {
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

    handleUpdateContact = async () => {
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

    handleDeleteContact = async () => {
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
