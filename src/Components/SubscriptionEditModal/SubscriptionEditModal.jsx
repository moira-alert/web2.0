// @flow
import * as React from "react";
import Button from "retail-ui/components/Button";
import { ValidationContainer } from "react-ui-validations";
import Modal from "retail-ui/components/Modal";
import Gapped from "retail-ui/components/Gapped";
import type { Subscription } from "../../Domain/Subscription";
import type { Contact } from "../../Domain/Contact";
import SubscriptionEditor from "../SubscriptionEditor/SubscriptionEditor";

type Props = {
    subscription: Subscription,
    tags: Array<string>,
    contacts: Array<Contact>,
    onChange: ($Shape<Subscription>) => void,
    onCancel: () => void,
    onRemoveSubscription: Subscription => Promise<void>,
    onUpdateSubscription: Subscription => Promise<void>,
    onUpdateAndTestSubscription: Subscription => Promise<void>,
};

type State = {
    updateInProcess: boolean,
    updateAndTestInProcess: boolean,
    deleteInProcess: boolean,
};

export default class SubscriptionEditModal extends React.Component<Props, State> {
    state: State;

    validationContainer: { current: null | ValidationContainer };

    constructor(props: Props) {
        super(props);
        this.state = {
            updateInProcess: false,
            updateAndTestInProcess: false,
            deleteInProcess: false,
        };
        this.validationContainer = React.createRef<ValidationContainer>();
    }

    render(): React.Node {
        const { subscription, tags, contacts, onChange, onCancel } = this.props;
        const { updateInProcess, updateAndTestInProcess, deleteInProcess } = this.state;
        const isActionButtonsDisabled =
            updateInProcess || updateAndTestInProcess || deleteInProcess;
        return (
            <Modal ignoreBackgroundClick onClose={onCancel}>
                <Modal.Header sticky={false}>Edit subscription</Modal.Header>
                <Modal.Body>
                    <ValidationContainer ref={this.validationContainer}>
                        <SubscriptionEditor
                            subscription={subscription}
                            onChange={onChange}
                            tags={tags}
                            contacts={contacts}
                        />
                    </ValidationContainer>
                </Modal.Body>
                <Modal.Footer panel sticky>
                    <Gapped gap={10}>
                        <Button
                            use="primary"
                            disabled={isActionButtonsDisabled}
                            loading={updateInProcess}
                            onClick={() => {
                                this.handleUpdate();
                            }}
                        >
                            Update
                        </Button>
                        <Button
                            disabled={isActionButtonsDisabled}
                            loading={updateAndTestInProcess}
                            onClick={() => {
                                this.handleUpdateAndTest();
                            }}
                        >
                            Update and test
                        </Button>
                        <Button
                            disabled={isActionButtonsDisabled}
                            loading={deleteInProcess}
                            onClick={() => {
                                this.handleDelete();
                            }}
                        >
                            Delete
                        </Button>
                        <Button use="link" disabled={isActionButtonsDisabled} onClick={onCancel}>
                            Cancel
                        </Button>
                    </Gapped>
                </Modal.Footer>
            </Modal>
        );
    }

    handleUpdate = async () => {
        if (!(await this.validateForm())) {
            return;
        }
        const { subscription, onUpdateSubscription } = this.props;
        this.setState({ updateInProcess: true });
        try {
            await onUpdateSubscription(subscription);
        } finally {
            this.setState({ updateInProcess: false });
        }
    };

    handleUpdateAndTest = async () => {
        if (!(await this.validateForm())) {
            return;
        }
        const { subscription, onUpdateAndTestSubscription } = this.props;
        this.setState({ updateAndTestInProcess: true });
        try {
            await onUpdateAndTestSubscription(subscription);
        } finally {
            this.setState({ updateAndTestInProcess: false });
        }
    };

    handleDelete = async () => {
        const { subscription, onRemoveSubscription } = this.props;
        this.setState({ deleteInProcess: true });
        try {
            await onRemoveSubscription(subscription);
        } finally {
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
