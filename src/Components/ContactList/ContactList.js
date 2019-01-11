// @flow
import * as React from "react";
import type { Contact } from "../../Domain/Contact";
import type { ContactConfig } from "../../Domain/Config";
import NewContactModal, { type NewContactInfo } from "../NewContactModal/NewContactModal";
import ContactEditModal from "../ContactEditModal/ContactEditModal";
import Button from "retail-ui/components/Button";
import Center from "retail-ui/components/Center";
import Gapped from "retail-ui/components/Gapped";
import Link from "retail-ui/components/Link";
import AddIcon from "@skbkontur/react-icons/Add";
import ContactTypeIcon from "../ContactTypeIcon/ContactTypeIcon";
import cn from "./ContactList.less";

type Props = ReactExactProps<{
    items: Array<Contact>,
    contactDescriptions: Array<ContactConfig>,
    onTestContact: Contact => Promise<void>,
    onAddContact: NewContactInfo => Promise<?Contact>,
    onUpdateContact: Contact => Promise<void>,
    onRemoveContact: Contact => Promise<void>,
}>;

type State = {
    newContactModalVisible: boolean,
    newContact: ?NewContactInfo,
    editContactModalVisible: boolean,
    editableContact: ?Contact,
};

export default class ContactList extends React.Component<Props, State> {
    props: Props;
    state: State = {
        newContactModalVisible: false,
        newContact: null,
        editContactModalVisible: false,
        editableContact: null,
    };

    handleCreateAndTestContact = async () => {
        const { onAddContact, onTestContact } = this.props;
        const { newContact } = this.state;
        if (newContact == null) {
            throw new Error("InvalidProgramState");
        }
        try {
            const contact = await onAddContact(newContact);
            if (contact !== null) {
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

    handleChangeNewContact = (newContactUpdate: $Shape<NewContactInfo>) => {
        const { newContact } = this.state;
        this.setState({
            newContact: { ...newContact, ...newContactUpdate },
        });
    };

    handleCreateNewContact = async (): Promise<void> => {
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

    handleDeleteContact = async (): Promise<void> => {
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
            newContact: {
                type: null,
                value: "",
            },
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

    renderContactIcon(type: string): React.Element<any> {
        return <ContactTypeIcon type={type} />;
    }

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
                        <Link onClick={this.handleAddContact}>add delivery channel</Link> for notifications.
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

    render(): React.Element<any> {
        const { items, contactDescriptions } = this.props;
        const { newContact, newContactModalVisible, editContactModalVisible, editableContact } = this.state;

        return (
            <div>
                {items.length > 0 ? (
                    <div>
                        <h3 className={cn("header")}>Delivery channels</h3>
                        <div className={cn("items-cotnainer")}>
                            <table className={cn("items")}>
                                <tbody>
                                    {items.map(contact => (
                                        <tr
                                            key={contact.id}
                                            className={cn("item")}
                                            onClick={() => this.handleBeginEditContact(contact)}>
                                            <td className={cn("icon")}>{this.renderContactIcon(contact.type)}</td>
                                            <td className={cn("value")}>{contact.value}</td>
                                        </tr>
                                    ))}
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
                {newContactModalVisible && newContact != null && (
                    <NewContactModal
                        contactDescriptions={contactDescriptions}
                        contactInfo={newContact}
                        onChange={this.handleChangeNewContact}
                        onCancel={this.handleCancelCreateNewContact}
                        onCreate={this.handleCreateNewContact}
                        onCreateAndTest={this.handleCreateAndTestContact}
                    />
                )}
                {editContactModalVisible && editableContact != null && (
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
}
