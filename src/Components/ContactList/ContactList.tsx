import React, { useState } from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Center } from "@skbkontur/react-ui/components/Center";
import { Gapped } from "@skbkontur/react-ui/components/Gapped";
import AddIcon from "@skbkontur/react-icons/Add";
import { ContactWithCustomName } from "./Components/ContactWithCustomName";
import WarningIcon from "@skbkontur/react-icons/Warning";
import { Contact } from "../../Domain/Contact";
import { ContactConfig } from "../../Domain/Config";
import NewContactModal from "../NewContactModal/NewContactModal";
import ContactEditModal from "../ContactEditModal/ContactEditModal";
import ContactTypeIcon from "../ContactTypeIcon/ContactTypeIcon";
import { isEmptyString } from "../../helpers/isEmptyString";
import { Settings } from "../../Domain/Settings";
import { useDeleteContactMutation } from "../../services/ContactApi";
import { useParams } from "react-router";
import classNames from "classnames/bind";

import styles from "./ContactList.less";

const cn = classNames.bind(styles);

interface IContactListProps {
    items: Array<Contact>;
    contactDescriptions: Array<ContactConfig>;
    settings?: Settings;
}

const ContactList: React.FC<IContactListProps> = ({ items, contactDescriptions, settings }) => {
    const { teamId } = useParams<{ teamId: string }>();
    const [newContactModalVisible, setNewContactModalVisible] = useState(false);
    const [editContactModalVisible, setEditContactModalVisible] = useState(false);
    const [newContact, setNewContact] = useState<Partial<Contact> | null>(null);
    const [editableContact, setEditableContact] = useState<Contact | null>(null);
    const [deleteContact] = useDeleteContactMutation();

    const handleCancelCreateNewContact = (): void => {
        setNewContactModalVisible(false);
        setNewContact(null);
    };

    const handleChangeNewContact = (newContactUpdate: Partial<Contact>): void => {
        setNewContact((prevNewContact) => ({
            ...prevNewContact,
            ...newContactUpdate,
        }));
    };

    const handleAddContact = (): void => {
        setNewContactModalVisible(true);
    };

    const handleBeginEditContact = (contact: Contact): void => {
        setEditContactModalVisible(true);
        setEditableContact(contact);
    };

    const handleChangeEditableContact = (contactUpdate: Contact): void => {
        setEditableContact((prevEditableContact) => ({
            ...prevEditableContact,
            ...contactUpdate,
        }));
    };

    const handleCancelEditContact = (): void => {
        setEditContactModalVisible(false);
        setEditableContact(null);
    };

    const isDeleteContactButtonDisabled = !!(
        editableContact?.id &&
        settings?.subscriptions.some((sub) => sub.contacts.includes(editableContact.id))
    );

    const renderEmptyListMessage = (): React.ReactNode => (
        <Center>
            <Gapped vertical gap={20}>
                <div style={{ textAlign: "center" }}>
                    To start receiving notifications you have to{" "}
                    <Button use="link" onClick={handleAddContact}>
                        add delivery channel
                    </Button>{" "}
                    for notifications.
                </div>
                <Center>
                    <Button use="primary" icon={<AddIcon />} onClick={handleAddContact}>
                        Add delivery channel
                    </Button>
                </Center>
            </Gapped>
        </Center>
    );

    return (
        <div>
            {items.length > 0 ? (
                <div>
                    <h3 className={cn("header")}>Delivery channels</h3>
                    <div className={cn("items-container")}>
                        <table className={cn("items")}>
                            <tbody>
                                {items.map((contact) => {
                                    if (
                                        contactDescriptions.some(
                                            (description) => description.type === contact.type
                                        )
                                    ) {
                                        const { name, value, type } = contact;
                                        return (
                                            <tr
                                                key={contact.id}
                                                className={cn("item")}
                                                onClick={() => handleBeginEditContact(contact)}
                                            >
                                                <td className={cn("icon")}>
                                                    <ContactTypeIcon type={type} />
                                                </td>
                                                <td>
                                                    {isEmptyString(name) ? (
                                                        value
                                                    ) : (
                                                        <ContactWithCustomName
                                                            contactValue={value}
                                                            contactName={name}
                                                        />
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    }

                                    return (
                                        <tr className={cn("item")} key={contact.id}>
                                            <td className={cn("error-icon")}>
                                                <WarningIcon />
                                            </td>
                                            <td>
                                                {isEmptyString(contact.name)
                                                    ? contact.value
                                                    : contact.name}
                                                <span className={cn("error-message")}>
                                                    Contact type {contact.type} not more support.{" "}
                                                    <Button
                                                        use="link"
                                                        onClick={() =>
                                                            deleteContact({
                                                                id: contact.id,
                                                                isTeamContact: !!teamId,
                                                            })
                                                        }
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
                        <Button icon={<AddIcon />} onClick={handleAddContact}>
                            Add delivery channel
                        </Button>
                    </div>
                </div>
            ) : (
                renderEmptyListMessage()
            )}
            {newContactModalVisible && (
                <NewContactModal
                    contactInfo={newContact}
                    onChange={handleChangeNewContact}
                    onCancel={handleCancelCreateNewContact}
                />
            )}
            {editContactModalVisible && editableContact !== null && (
                <ContactEditModal
                    isDeleteContactButtonDisabled={isDeleteContactButtonDisabled}
                    contactInfo={editableContact}
                    onChange={handleChangeEditableContact}
                    onCancel={handleCancelEditContact}
                />
            )}
        </div>
    );
};

export default ContactList;
