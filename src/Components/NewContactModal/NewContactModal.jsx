// @flow
import * as React from "react";
import { Modal, Gapped, Button } from "@skbkontur/react-ui";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import type { ContactConfig } from "../../Domain/Config";
import type { Contact } from "../../Domain/Contact";
import ContactEditForm from "../ContactEditForm/ContactEditForm";

type Props = {|
    contactDescriptions: Array<ContactConfig>,
    contactInfo: $Shape<Contact> | null,
    onChange: ($Shape<Contact>) => void,
    onCancel: () => void,
    onCreate: () => Promise<void>,
    onCreateAndTest: () => Promise<void>,
|};

type State = {
    createInProcess: boolean,
    createAndTestInProcess: boolean,
};

export default class NewContactModal extends React.Component<Props, State> {
    state: State;

    validationContainer: { current: ValidationContainer | null };

    constructor(props: Props) {
        super(props);
        this.state = {
            createInProcess: false,
            createAndTestInProcess: false,
        };
        this.validationContainer = React.createRef<ValidationContainer>();
    }

    render(): React.Node {
        const { onChange, onCancel, contactInfo, contactDescriptions } = this.props;
        const { createInProcess, createAndTestInProcess } = this.state;
        const { value, type } = contactInfo || {};
        const idActionButtonsDisabled =
            !value || !type || createInProcess || createAndTestInProcess;

        return (
            <Modal onClose={onCancel} ignoreBackgroundClick>
                <Modal.Header sticky={false}>Delivery channel adding</Modal.Header>
                <Modal.Body>
                    <ValidationContainer ref={this.validationContainer}>
                        <ContactEditForm
                            contactDescriptions={contactDescriptions}
                            contactInfo={contactInfo}
                            onChange={onChange}
                        />
                    </ValidationContainer>
                </Modal.Body>
                <Modal.Footer panel sticky>
                    <Gapped gap={10}>
                        <Button
                            use="primary"
                            loading={createInProcess}
                            disabled={idActionButtonsDisabled}
                            onClick={() => {
                                this.handleCreateContact();
                            }}
                        >
                            Add
                        </Button>
                        <Button
                            disabled={idActionButtonsDisabled}
                            loading={createAndTestInProcess}
                            onClick={() => {
                                this.handleCreateAndTestContact();
                            }}
                        >
                            Add and test
                        </Button>
                    </Gapped>
                </Modal.Footer>
            </Modal>
        );
    }

    handleCreateContact = async () => {
        if (!(await this.validateForm())) {
            return;
        }
        const { onCreate } = this.props;
        this.setState({ createInProcess: true });
        try {
            await onCreate();
        } catch (error) {
            this.setState({ createInProcess: false });
        }
    };

    handleCreateAndTestContact = async () => {
        if (!(await this.validateForm())) {
            return;
        }
        const { onCreateAndTest } = this.props;
        this.setState({ createAndTestInProcess: true });
        try {
            await onCreateAndTest();
        } catch (error) {
            this.setState({ createAndTestInProcess: false });
        }
    };

    async validateForm(): Promise<boolean> {
        if (this.validationContainer.current == null) {
            return true;
        }
        return this.validationContainer.current.validate();
    }
}
