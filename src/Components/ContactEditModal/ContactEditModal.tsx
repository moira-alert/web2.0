import React, { FC, useRef, useState } from "react";
import { Modal } from "@skbkontur/react-ui/components/Modal";
import { Button } from "@skbkontur/react-ui/components/Button";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Fill, RowStack } from "@skbkontur/react-stack-layout";
import { Contact } from "../../Domain/Contact";
import { omitContact } from "../../helpers/omitTypes";
import ContactEditForm from "../ContactEditForm/ContactEditForm";
import FileExport from "../FileExport/FileExport";
import { ResourceIDBadge } from "../ResourceIDBadge/ResourceIDBadge";
import ModalError from "../ModalError/ModalError";
import { useParams } from "react-router";
import { useUpdateContact } from "../../hooks/useUpdateContact";
import { useDeleteContact } from "../../hooks/useDeleteContact";

interface IContactEditModalProps {
    contactInfo: Contact | null;
    isDeleteContactButtonDisabled?: boolean;
    onCancel: () => void;
}

const ContactEditModal: FC<IContactEditModalProps> = ({
    contactInfo,
    isDeleteContactButtonDisabled,
    onCancel,
}) => {
    const [contact, setContact] = useState<Contact | null>(contactInfo);
    const validationContainer = useRef<ValidationContainer>(null);
    const { teamId } = useParams<{ teamId: string }>();
    const [error, setError] = useState<string | null>(null);
    const { handleUpdateContact, isUpdating, isTesting } = useUpdateContact(
        validationContainer,
        contact,
        onCancel,
        setError,
        teamId
    );
    const { handleDeleteContact, isDeleting } = useDeleteContact(
        contact,
        onCancel,
        setError,
        teamId
    );

    const isActionButtonDisabled = isTesting || isUpdating || isDeleting;

    return (
        contact && (
            <Modal onClose={onCancel}>
                <Modal.Header sticky={false}>Delivery channel editing</Modal.Header>
                <Modal.Body>
                    <ResourceIDBadge title="Channel id:" id={contact.id} />
                    <ValidationContainer ref={validationContainer}>
                        <ContactEditForm
                            contactInfo={contact}
                            onChange={(update) => {
                                setContact((prev) => ({ ...prev, ...update } as Contact));
                            }}
                        />
                    </ValidationContainer>
                </Modal.Body>
                <Modal.Footer panel sticky>
                    <ModalError message={error as string} maxWidth="450px" />
                    <RowStack gap={2} block baseline>
                        <Button
                            use="primary"
                            disabled={isActionButtonDisabled}
                            loading={isUpdating}
                            onClick={() => handleUpdateContact()}
                        >
                            Save
                        </Button>
                        <Button
                            loading={isTesting}
                            disabled={isActionButtonDisabled}
                            onClick={() => handleUpdateContact(true)}
                        >
                            Save and test
                        </Button>
                        <FileExport
                            isButton
                            title={`delivery channel ${contact.type} ${contact.value}`}
                            data={omitContact(contact)}
                        >
                            Export
                        </FileExport>
                        <Fill />

                        <Button
                            use="danger"
                            loading={isDeleting}
                            disabled={isActionButtonDisabled || isDeleteContactButtonDisabled}
                            onClick={handleDeleteContact}
                        >
                            Delete
                        </Button>
                    </RowStack>
                </Modal.Footer>
            </Modal>
        )
    );
};

export default ContactEditModal;
