// @flow
import React from 'react';
import Modal from 'retail-ui/components/Modal';
import Gapped from 'retail-ui/components/Gapped';
import Button from 'retail-ui/components/Button';
import Link from 'retail-ui/components/Link';
import { ValidationContainer } from 'react-ui-validations';
import ContactEditForm, { type ContactInfo } from '../ContactEditForm/ContactEditForm';

export type NewContactInfo = ContactInfo;

type Props = {
    contactInfo: ContactInfo;
    onChange: ($Shape<ContactInfo>) => void;
    onCancel: () => void;
    onCreate: () => Promise<void>;
    onCreateAndTest: () => Promise<void>;
};

type State = {
    createInProcess: boolean;
    createAndTestInProcess: boolean;
};

export default class NewContactModal extends React.Component {
    props: Props;
    state: State = {
        createInProcess: false,
        createAndTestInProcess: false,
    };

    handleCreateContact = async () => {
        if (!await this.validateForm()) {
            return;
        }
        const { onCreate } = this.props;
        this.setState({ createInProcess: true });
        try {
            await onCreate();
        }
        catch (error) {
            this.setState({ createInProcess: false });
        }
    };

    handleCreateAndTestContact = async () => {
        if (!await this.validateForm()) {
            return;
        }
        const { onCreateAndTest } = this.props;
        this.setState({ createAndTestInProcess: true });
        try {
            await onCreateAndTest();
        }
        catch (error) {
            this.setState({ createAndTestInProcess: false });
        }
    };

    async validateForm(): Promise<boolean> {
        return await this.refs.container.validate();
    }

    render(): React.Element<*> {
        const { onChange, onCancel, contactInfo } = this.props;
        const { createInProcess, createAndTestInProcess } = this.state;
        const { value, type } = contactInfo;
        const idActionButtonsDisabled = type == null || value == null || createInProcess || createAndTestInProcess;

        return (
            <Modal onClose={onCancel} ignoreBackgroundClick>
                <Modal.Header>Add delivery channel</Modal.Header>
                <Modal.Body>
                    <ValidationContainer ref='container'>
                        <ContactEditForm contactInfo={contactInfo} onChange={onChange} />
                    </ValidationContainer>
                </Modal.Body>
                <Modal.Footer panel>
                    <Gapped gap={10}>
                        <Button
                            disabled={idActionButtonsDisabled}
                            loading={createAndTestInProcess}
                            use='primary'
                            onClick={() => {
                                this.handleCreateAndTestContact();
                            }}>
                            Add channel and test
                        </Button>
                        <Button
                            loading={createInProcess}
                            disabled={idActionButtonsDisabled}
                            onClick={() => {
                                this.handleCreateContact();
                            }}>
                            Add delivery channel
                        </Button>
                        <Link onClick={onCancel} disabled={createInProcess || createAndTestInProcess}>
                            Cancel
                        </Link>
                    </Gapped>
                </Modal.Footer>
            </Modal>
        );
    }
}
