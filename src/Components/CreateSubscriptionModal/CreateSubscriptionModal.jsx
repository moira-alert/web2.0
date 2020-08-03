// @flow
import * as React from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Modal } from "@skbkontur/react-ui/components/Modal";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Fill, RowStack } from "@skbkontur/react-stack-layout";
import type { Contact } from "../../Domain/Contact";
import { omitSubscription } from "../../helpers/omitTypes";
import SubscriptionEditor, {
    type SubscriptionInfo,
} from "../SubscriptionEditor/SubscriptionEditor";
import FileLoader from "../FileLoader/FileLoader";
import ModalError from "../ModalError/ModalError";

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
    error?: string,
};

export default class SubscriptionEditModal extends React.Component<Props, State> {
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
        const { subscription, tags, contacts, onCancel } = this.props;
        const { createInProcess, createAndTestInProcess, error } = this.state;
        const isActionButtonsDisabled = createInProcess || createAndTestInProcess;

        return (
            <Modal ignoreBackgroundClick onClose={onCancel}>
                <Modal.Header sticky={false}>Subscription adding</Modal.Header>
                <Modal.Body>
                    <ValidationContainer ref={this.validationContainer}>
                        <SubscriptionEditor
                            subscription={subscription}
                            onChange={this.handleChange}
                            tags={tags}
                            contacts={contacts}
                        />
                    </ValidationContainer>
                </Modal.Body>
                <Modal.Footer panel sticky>
                    <ModalError message={error} maxWidth="450px" />
                    <RowStack gap={2} block baseline>
                        <Button
                            use="primary"
                            disabled={isActionButtonsDisabled}
                            loading={createInProcess}
                            onClick={this.handleCreate}
                        >
                            Add
                        </Button>
                        <Button
                            disabled={isActionButtonsDisabled}
                            loading={createAndTestInProcess}
                            onClick={this.handleCreateAndTest}
                        >
                            Add and test
                        </Button>
                        <Fill />
                        <FileLoader onLoad={this.handleImport}>Import subscription</FileLoader>
                    </RowStack>
                </Modal.Footer>
            </Modal>
        );
    }

    handleChange = (subscription: $Shape<SubscriptionInfo>) => {
        const { onChange } = this.props;
        onChange(subscription);
        this.setState({ error: undefined });
    };

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

    handleImport = (fileData: string, fileName: string) => {
        try {
            const subscription = JSON.parse(fileData);

            if (typeof subscription === "object" && subscription !== null) {
                this.handleChange(omitSubscription(subscription));
            } else {
                throw new Error(`Must be a subscription object`);
            }
        } catch (e) {
            this.setState({
                error: `File ${fileName} cannot be converted to subscription. ${e.message}`,
            });
        }
    };

    async validateForm(): Promise<boolean> {
        if (this.validationContainer.current == null) {
            return true;
        }
        return this.validationContainer.current.validate();
    }
}
