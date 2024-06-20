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
import {
    useDeleteContactMutation,
    useTestContactMutation,
    useUpdateContactMutation,
} from "../../services/ContactApi";
import ModalError from "../ModalError/ModalError";
import { useParams } from "react-router";

interface IContactEditModalProps {
    contactInfo: Contact | null;
    isDeleteContactButtonDisabled?: boolean;
    onChange: (contact: Contact) => void;
    onCancel: () => void;
}

const ContactEditModal: FC<IContactEditModalProps> = ({
    contactInfo,
    isDeleteContactButtonDisabled,
    onChange,
    onCancel,
}) => {
    const validationContainer = useRef<ValidationContainer>(null);
    const { teamId } = useParams<{ teamId: string }>();
    const [updateContact, { isLoading: isUpdating }] = useUpdateContactMutation();
    const [testContact, { isLoading: isTesting }] = useTestContactMutation();
    const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();
    const [error, setError] = useState<string | null>(null);
    const isActionButtonDisabled = isTesting || isUpdating || isDeleting;

    const handleUpdateContact = async (testAfterUpdate?: boolean): Promise<void> => {
        if (!(await validateForm()) || !contactInfo) {
            return;
        }

        try {
            await updateContact({ ...contactInfo, isTeamContact: !!teamId }).unwrap();
            if (testAfterUpdate) {
                await testContact(contactInfo.id).unwrap();
            }
            onCancel();
        } catch (error) {
            setError(error);
        }
    };

    const handleDeleteContact = async (): Promise<void> => {
        if (!contactInfo) {
            return;
        }

        try {
            await deleteContact({ id: contactInfo.id, isTeamContact: !!teamId }).unwrap();
            onCancel();
        } catch (error) {
            setError(error);
        }
    };

    const validateForm = async (): Promise<boolean> => {
        if (!validationContainer.current) {
            return true;
        }
        return validationContainer.current.validate();
    };

    return (
        contactInfo && (
            <Modal onClose={onCancel}>
                <Modal.Header sticky={false}>Delivery channel editing</Modal.Header>
                <Modal.Body>
                    <ResourceIDBadge title="Channel id:" id={contactInfo.id} />
                    <ValidationContainer ref={validationContainer}>
                        <ContactEditForm
                            contactInfo={contactInfo}
                            onChange={(update) => {
                                onChange({ ...contactInfo, ...update });
                                setError(null);
                            }}
                        />
                    </ValidationContainer>
                </Modal.Body>
                <Modal.Footer panel sticky>
                    <ModalError message={error} maxWidth="450px" />
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
                            title={`delivery channel ${contactInfo.type} ${contactInfo.value}`}
                            data={omitContact(contactInfo)}
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
