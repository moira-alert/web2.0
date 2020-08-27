import * as React from "react";
import { Modal } from "@skbkontur/react-ui/components/Modal";
import { Button } from "@skbkontur/react-ui/components/Button";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Fill, RowStack } from "@skbkontur/react-stack-layout";
import { ContactConfig } from "../../Domain/Config";
import { Contact } from "../../Domain/Contact";
import { omitContact } from "../../helpers/omitTypes";
import ContactEditForm from "../ContactEditForm/ContactEditForm";
import FileLoader from "../FileLoader/FileLoader";
import ModalError from "../ModalError/ModalError";

type Props = {
    contactDescriptions: Array<ContactConfig>;
    contactInfo: Partial<Contact> | null;
    onChange: (contactObject: Partial<Contact>) => void;
    onCancel: () => void;
    onCreate: () => Promise<void>;
    onCreateAndTest: () => Promise<void>;
};

type State = {
    createInProcess: boolean;
    createAndTestInProcess: boolean;
    error?: string;
};

export default class NewContactModal extends React.Component<Props, State> {
    public state: State;

    readonly validationContainer: { current: ValidationContainer | null };

    constructor(props: Props) {
        super(props);
        this.state = {
            createInProcess: false,
            createAndTestInProcess: false,
        };
        this.validationContainer = React.createRef<ValidationContainer>();
    }

    render(): React.ReactNode {
        const { onCancel, contactInfo, contactDescriptions } = this.props;
        const { createInProcess, createAndTestInProcess, error } = this.state;
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
                            onChange={this.handleChange}
                        />
                    </ValidationContainer>
                </Modal.Body>
                <Modal.Footer panel sticky>
                    <ModalError message={error} maxWidth="450px" />
                    <RowStack gap={2} block baseline>
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
                        <Fill />
                        <FileLoader onLoad={this.handleImport}>Import delivery channel</FileLoader>
                    </RowStack>
                </Modal.Footer>
            </Modal>
        );
    }

    handleChange = (contact: Partial<Contact>): void => {
        const { contactInfo, onChange } = this.props;
        onChange({ ...contactInfo, ...contact });
        this.setState({ error: undefined });
    };

    handleCreateContact = async (): Promise<void> => {
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

    handleCreateAndTestContact = async (): Promise<void> => {
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

    handleImport = (fileData: string | ArrayBuffer | null, fileName: string): void => {
        const { contactDescriptions } = this.props;
        try {
            if (typeof fileData !== "string") {
                throw new Error("Expected fileData to be a string");
            }

            const newContact = JSON.parse(fileData);

            if (typeof newContact !== "object" || newContact === null) {
                throw new Error("Must be a delivery channel object");
            }

            if (contactDescriptions.every(({ type }) => type !== newContact.type)) {
                throw new Error(
                    `Type must be one of ${contactDescriptions.map(({ type }) => type).join(", ")}`
                );
            }
            if (typeof newContact.value !== "string") {
                throw new Error("Value must be string");
            }

            this.handleChange(omitContact(newContact));
        } catch (e) {
            this.setState({
                error: `File ${fileName} cannot be converted to delivery channel. ${e.message}`,
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
