// @flow
import * as React from "react";
import Button from "retail-ui/components/Button";
import { ValidationContainer } from "react-ui-validations";
import Link from "retail-ui/components/Link";
import Modal from "retail-ui/components/Modal";
import Gapped from "retail-ui/components/Gapped";
import type { Contact } from "../../Domain/Contact";
import SubscriptionEditor, { type SubscriptionInfo } from "../SubscriptionEditor/SubscriptionEditor";

type Props = {
    subscription: SubscriptionInfo,
    tags: Array<string>,
    contacts: Array<Contact>,
    onChange: ($Shape<SubscriptionInfo>) => void,
    onCancel: () => void,
    onCreateSubscription: SubscriptionInfo => Promise<void>,
    onCreateAndTestSubscription: SubscriptionInfo => Promise<void>,
};

type State = {
    createInProcess: boolean,
    createAndTestInProcess: boolean,
};

export default class SubscriptionEditModal extends React.Component<Props, State> {
    props: Props;
    state: State = {
        createInProcess: false,
        createAndTestInProcess: false,
    };

    async validateForm(): Promise<boolean> {
        return await this.refs.container.validate();
    }

    handleCreate = async () => {
        if (!(await this.validateForm())) {
            return;
        }
        const { subscription, onCreateSubscription } = this.props;
        this.setState({ createInProcess: true });
        try {
            await onCreateSubscription(subscription);
        } finally {
            this.setState({ createInProcess: false });
        }
    };

    handleCreateAndTest = async () => {
        if (!(await this.validateForm())) {
            return;
        }
        const { subscription, onCreateAndTestSubscription } = this.props;
        this.setState({ createAndTestInProcess: true });
        try {
            await onCreateAndTestSubscription(subscription);
        } finally {
            this.setState({ createAndTestInProcess: false });
        }
    };

    render(): React.Node {
        const { subscription, tags, contacts, onChange, onCancel } = this.props;
        const { createInProcess, createAndTestInProcess } = this.state;
        const isActionButtonsDisabled = createInProcess || createAndTestInProcess;

        return (
            <Modal ignoreBackgroundClick onClose={onCancel}>
                <Modal.Header>Create subscription</Modal.Header>
                <Modal.Body>
                    <ValidationContainer ref="container">
                        <SubscriptionEditor
                            subscription={subscription}
                            onChange={onChange}
                            tags={tags}
                            contacts={contacts}
                        />
                    </ValidationContainer>
                </Modal.Body>
                <Modal.Footer panel>
                    <Gapped gap={10}>
                        <Button
                            use="primary"
                            disabled={isActionButtonsDisabled}
                            loading={createInProcess}
                            onClick={() => {
                                this.handleCreate();
                            }}>
                            Create
                        </Button>
                        <Button
                            disabled={isActionButtonsDisabled}
                            loading={createAndTestInProcess}
                            onClick={() => {
                                this.handleCreateAndTest();
                            }}>
                            Create and test
                        </Button>
                        <Link disabled={isActionButtonsDisabled} onClick={onCancel}>
                            Cancel
                        </Link>
                    </Gapped>
                </Modal.Footer>
            </Modal>
        );
    }
}
