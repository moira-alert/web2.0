// @flow
import * as React from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Center } from "@skbkontur/react-ui/components/Center";
import { Gapped } from "@skbkontur/react-ui/components/Gapped";
import AddIcon from "@skbkontur/react-icons/Add";
import WarningIcon from "@skbkontur/react-icons/Warning";
import type { Contact } from "../../Domain/Contact";
import type { ContactConfig } from "../../Domain/Config";
import NewContactModal from "../NewContactModal/NewContactModal";
import ContactEditModal from "../ContactEditModal/ContactEditModal";
import ContactTypeIcon from "../ContactTypeIcon/ContactTypeIcon";
import cn from "./ContactList.less";

type Props = $Exact<{
    items: Array<Contact>,
    contactDescriptions: Array<ContactConfig>,
    onTestContact: Contact => Promise<void>,
    onAddContact: ($Shape<Contact>) => Promise<?Contact>,
    onUpdateContact: Contact => Promise<void>,
    onRemoveContact: Contact => Promise<void>,
}>;

type State = {
    newContactModalVisible: boolean,
    newContact: $Shape<Contact> | null,
    editContactModalVisible: boolean,
    editableContact: Contact | null,
};

export default class ContactList extends React.Component<Props, State> {
    props: Props;

    state: State = {
        newContactModalVisible: false,
        newContact: null,
        editContactModalVisible: false,
        editableContact: null,
    };

    render(): React.Element<any> {
        const { items, contactDescriptions, onRemoveContact } = this.props;
        const {
            newContact,
            newContactModalVisible,
            editContactModalVisible,
            editableContact,
        } = this.state;

        return (
            <div>
                {items.length > 0 ? (
                    <div>
                        <h3 className={cn("header")}>Delivery channels</h3>
                        <div className={cn("items-cotnainer")}>
                            <table className={cn("items")}>
                                <tbody>
                                    {items.map(contact => {
                                        if (
                                            contactDescriptions.some(
                                                description => description.type === contact.type
                                            )
                                        ) {
                                            return (
                                                <tr
                                                    key={contact.id}
                                                    className={cn("item")}
                                                    onClick={() =>
                                                        this.handleBeginEditContact(contact)
                                                    }
                                                >
                                                    <td className={cn("icon")}>
                                                        <ContactTypeIcon type={contact.type} />
                                                    </td>
                                                    <td>{contact.value}</td>
                                                </tr>
                                            );
                                        }

                                        return (
                                            <tr className={cn("item")} key={contact.id}>
                                                <td className={cn("error-icon")}>
                                                    <WarningIcon />
                                                </td>
                                                <td>
                                                    {contact.value}
                                                    <span className={cn("error-message")}>
                                                        Contact type {contact.type} not more
                                                        support.{" "}
                                                        <Button
                                                            use="link"
                                                            onClick={() => onRemoveContact(contact)}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className={cn("actions-block")}>
                            <Button icon={<AddIcon />} onClick={this.handleAddContact}>
                                Add delivery channel
                            </Button>
                        </div>
                    </div>
                ) : (
                    this.renderEmptyListMessage()
                )}
                {newContactModalVisible && (
                    <NewContactModal
                        contactDescriptions={contactDescriptions}
                        contactInfo={newContact}
                        onChange={this.handleChangeNewContact}
                        onCancel={this.handleCancelCreateNewContact}
                        onCreate={this.handleCreateNewContact}
                        onCreateAndTest={this.handleCreateAndTestContact}
                    />
                )}
                {editContactModalVisible && editableContact !== null && (
                    <ContactEditModal
                        contactDescriptions={contactDescriptions}
                        contactInfo={editableContact}
                        onChange={this.handleChangeEditableContact}
                        onCancel={this.handleCancelEditContact}
                        onUpdate={this.handleUpdateContact}
                        onUpdateAndTest={this.handleUpdateAndTestContact}
                        onDelete={this.handleDeleteContact}
                    />
                )}
            </div>
        );
    }

    handleCreateAndTestContact = async () => {
        const { onAddContact, onTestContact } = this.props;
        const { newContact } = this.state;
        if (newContact === null || newContact === undefined) {
            throw new Error("InvalidProgramState");
        }
        try {
            const contact = await onAddContact(newContact);
            if (contact !== null && contact !== undefined) {
                await onTestContact(contact);
            }
        } finally {
            this.setState({
                newContactModalVisible: false,
                newContact: null,
            });
        }
    };

    handleCancelCreateNewContact = () => {
        this.setState({
            newContactModalVisible: false,
            newContact: null,
        });
    };

    handleChangeNewContact = (newContactUpdate: $Shape<Contact>) => {
        const { newContact } = this.state;
        this.setState({
            newContact: { ...newContact, ...newContactUpdate },
        });
    };

    handleCreateNewContact = async () => {
        const { onAddContact } = this.props;
        const { newContact } = this.state;
        if (newContact == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            await onAddContact(newContact);
        } finally {
            this.setState({
                newContactModalVisible: false,
                newContact: null,
            });
        }
    };

    handleDeleteContact = async () => {
        const { onRemoveContact } = this.props;
        const { editableContact } = this.state;
        if (editableContact == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            await onRemoveContact(editableContact);
        } finally {
            this.setState({
                editContactModalVisible: false,
                editableContact: null,
            });
        }
    };

    handleAddContact = () => {
        this.setState({
            newContactModalVisible: true,
        });
    };

    handleBeginEditContact = (contact: Contact) => {
        this.setState({
            editContactModalVisible: true,
            editableContact: contact,
        });
    };

    handleRemoveContact = (contact: Contact) => {
        const { onRemoveContact } = this.props;
        onRemoveContact(contact);
    };

    handleChangeEditableContact = (contactUpdate: $Shape<Contact>) => {
        const { editableContact } = this.state;
        this.setState({
            editableContact: { ...editableContact, ...contactUpdate },
        });
    };

    handleCancelEditContact = () => {
        this.setState({
            editContactModalVisible: false,
            editableContact: null,
        });
    };

    handleUpdateContact = async () => {
        const { onUpdateContact } = this.props;
        const { editableContact } = this.state;
        if (editableContact == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            await onUpdateContact(editableContact);
        } finally {
            this.setState({
                editContactModalVisible: false,
                editableContact: null,
            });
        }
    };

    handleUpdateAndTestContact = async () => {
        const { onUpdateContact, onTestContact } = this.props;
        const { editableContact } = this.state;
        if (editableContact == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            await onUpdateContact(editableContact);
            await onTestContact(editableContact);
        } finally {
            this.setState({
                editContactModalVisible: false,
                editableContact: null,
            });
        }
    };

    renderEmptyListMessage(): React.Node {
        return (
            <Center>
                <Gapped vertical gap={20}>
                    <div>
                        To start receiving notifications you have to{" "}
                        <Button use="link" onClick={this.handleAddContact}>
                            add delivery channel
                        </Button>{" "}
                        for notifications.
                    </div>
                    <Center>
                        <Button use="primary" icon={<AddIcon />} onClick={this.handleAddContact}>
                            Add delivery channel
                        </Button>
                    </Center>
                </Gapped>
            </Center>
        );
    }
}
