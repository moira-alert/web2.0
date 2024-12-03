import React, { useState } from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
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
import { useModal } from "../../hooks/useModal";
import { ContactEventStats } from "../ContactEventStats/ContactEventStats";
import { useAppDispatch } from "../../store/hooks";
import { setError } from "../../store/Reducers/UIReducer.slice";
import { EmptyListMessage } from "./Components/EmptyListMessage";
import { useTheme } from "../../Themes";
import classNames from "classnames/bind";

import styles from "./ContactList.less";

const cn = classNames.bind(styles);

interface IContactItemProps {
    contact: Omit<Contact, "user" | "team">;
    contactDescriptions: ContactConfig[];
    onEdit: (contact: Omit<Contact, "user" | "team">) => void;
    onEventsClick: (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        contact: Omit<Contact, "user" | "team">
    ) => void;
    onDeleteContact: () => void;
}

const ContactItem: React.FC<IContactItemProps> = ({
    contact,
    contactDescriptions,
    onEdit,
    onEventsClick,
    onDeleteContact,
}) => {
    const { id, name, value, type } = contact;
    const [hover, setHover] = useState(false);
    const theme = useTheme();

    const hoverStyle = {
        backgroundColor: hover ? theme.itemHover : theme.appBgColorPrimary,
    };

    const isContactTypeSupported = contactDescriptions.some(
        (description) => description.type === type
    );

    return (
        <>
            {isContactTypeSupported ? (
                <tr
                    style={hoverStyle}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    className={cn("item")}
                    onClick={() =>
                        onEdit({
                            name,
                            value,
                            type,
                            id,
                        })
                    }
                >
                    <td className={cn("icon")}>
                        <ContactTypeIcon type={type} />
                    </td>
                    <td>
                        {isEmptyString(name) ? (
                            value
                        ) : (
                            <ContactWithCustomName contactValue={value} contactName={name} />
                        )}
                    </td>
                    <td className={cn("events")}>
                        <Button
                            onClick={(event) =>
                                onEventsClick(event, {
                                    type: "",
                                    name: "",
                                    value: "",
                                    id,
                                })
                            }
                        >
                            Events
                        </Button>
                    </td>
                </tr>
            ) : (
                <tr
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                    style={hoverStyle}
                    className={cn("item")}
                    key={id}
                >
                    <td className={cn("error-icon")}>
                        <WarningIcon />
                    </td>
                    <td>
                        {isEmptyString(name) ? value : name}
                        <span className={cn("error-message")}>
                            Contact type {type} not more support.{" "}
                            <Button use="link" onClick={onDeleteContact}>
                                Delete
                            </Button>
                        </span>
                    </td>
                    <td></td>
                </tr>
            )}
        </>
    );
};

interface IContactListProps {
    contacts: Array<Contact>;
    contactDescriptions: Array<ContactConfig>;
    settings?: Settings;
}

const ContactList: React.FC<IContactListProps> = ({ contacts, contactDescriptions, settings }) => {
    const { teamId } = useParams<{ teamId: string }>();

    const {
        isModalOpen: contactEventsVisible,
        openModal: openContactEventsSidePage,
        closeModal: closeContactEventsSidePage,
    } = useModal();
    const {
        isModalOpen: newContactModalVisible,
        openModal: openNewContactModal,
        closeModal: closeNewContactModal,
    } = useModal();
    const {
        isModalOpen: editContactModalVisible,
        openModal: openEditContactModal,
        closeModal: closeEditContactModal,
    } = useModal();
    const [editableContact, setEditableContact] = useState<Contact | null>(null);
    const [deleteContact] = useDeleteContactMutation();
    const dispatch = useAppDispatch();

    const handleBeginEditContact = (contact: Contact): void => {
        openEditContactModal();
        setEditableContact(contact);
    };

    const isDeleteContactButtonDisabled = !!(
        editableContact?.id &&
        settings?.subscriptions.some((sub) => sub.contacts.includes(editableContact.id))
    );

    const handleEventsButtonClick = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
        contact: Contact
    ) => {
        event.stopPropagation();
        openContactEventsSidePage();
        setEditableContact(contact);
        dispatch(setError(null));
    };

    return (
        <div>
            {contacts.length > 0 ? (
                <div>
                    <h3 className={cn("header")}>Delivery channels</h3>
                    <div className={cn("items-container")}>
                        <table className={cn("items")}>
                            <tbody>
                                {contacts.map(({ name, value, type, id }) => (
                                    <ContactItem
                                        key={id}
                                        contactDescriptions={contactDescriptions}
                                        contact={{ name, value, type, id }}
                                        onEdit={handleBeginEditContact}
                                        onEventsClick={handleEventsButtonClick}
                                        onDeleteContact={() =>
                                            deleteContact({
                                                id,
                                                tagsToInvalidate: [
                                                    teamId ? "TeamSettings" : "UserSettings",
                                                ],
                                            })
                                        }
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className={cn("actions-block")}>
                        <Button icon={<AddIcon />} onClick={openNewContactModal}>
                            Add delivery channel
                        </Button>
                    </div>
                </div>
            ) : (
                <EmptyListMessage onCLick={openNewContactModal} />
            )}
            {newContactModalVisible && <NewContactModal onCancel={closeNewContactModal} />}
            {editContactModalVisible && (
                <ContactEditModal
                    isDeleteContactButtonDisabled={isDeleteContactButtonDisabled}
                    contactInfo={editableContact}
                    onCancel={closeEditContactModal}
                />
            )}
            {contactEventsVisible && editableContact?.id && (
                <ContactEventStats
                    contactId={editableContact?.id}
                    onClose={closeContactEventsSidePage}
                />
            )}
        </div>
    );
};

export default ContactList;
