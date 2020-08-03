// @flow
import * as React from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Modal } from "@skbkontur/react-ui/components/Modal";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Fill, RowStack } from "@skbkontur/react-stack-layout";
import type { Subscription } from "../../Domain/Subscription";
import type { Contact } from "../../Domain/Contact";
import { omitSubscription } from "../../helpers/omitTypes";
import SubscriptionEditor from "../SubscriptionEditor/SubscriptionEditor";
import FileExport from "../FileExport/FileExport";

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
                <Modal.Header sticky={false}>Subscription editing</Modal.Header>
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
                    <RowStack gap={2} block baseline>
                        <Button
                            use="primary"
                            disabled={isActionButtonsDisabled}
                            loading={updateInProcess}
                            onClick={this.handleUpdate}
                        >
                            Save
                        </Button>
                        <Button
                            disabled={isActionButtonsDisabled}
                            loading={updateAndTestInProcess}
                            onClick={this.handleUpdateAndTest}
                        >
                            Save and test
                        </Button>
                        <FileExport
                            title={this.getFileName()}
                            data={omitSubscription(subscription)}
                        >
                            Export
                        </FileExport>
                        <Fill />
                        <Button
                            use="danger"
                            disabled={isActionButtonsDisabled}
                            loading={deleteInProcess}
                            onClick={this.handleDelete}
                        >
                            Delete
                        </Button>
                    </RowStack>
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

    getFileName = () => {
        const { subscription, contacts } = this.props;

        const contactValues = subscription.contacts.map(contactId => {
            const contact = contacts.find(c => c.id === contactId);
            return contact ? contact.value : contactId;
        });

        return `subscription ${contactValues.join(" ")} ${subscription.tags
            .slice(0, 5)
            .map(t => t.slice(0, 8))
            .join(" ")}`;
    };
}
