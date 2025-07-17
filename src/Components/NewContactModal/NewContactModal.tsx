import React, { FC, useState, useRef } from "react";
import { Modal } from "@skbkontur/react-ui/components/Modal";
import { Button } from "@skbkontur/react-ui/components/Button";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Fill, RowStack } from "@skbkontur/react-stack-layout";
import { Contact } from "../../Domain/Contact";
import { omitContact } from "../../helpers/omitTypes";
import ContactEditForm from "../ContactEditForm/ContactEditForm";
import FileLoader from "../FileLoader/FileLoader";
import ModalError from "../ModalError/ModalError";
import { useAppSelector } from "../../store/hooks";
import { ConfigState } from "../../store/selectors";
import { useParams } from "react-router";
import { useCreateContact } from "../../hooks/useCreateContact";

interface INewContactModalProps {
    onCancel: () => void;
}

const NewContactModal: FC<INewContactModalProps> = ({ onCancel }) => {
    const [contactInfo, setContactInfo] = useState<Partial<Contact> | null>(null);
    const { config } = useAppSelector(ConfigState);
    const { teamId } = useParams<{ teamId: string }>();
    const validationContainerRef = useRef<ValidationContainer>(null);
    const isInvalidContactInfo = !contactInfo || !contactInfo.value || !contactInfo.type;
    const [error, setError] = useState<string | null>(null);
    const { handleCreateContact, isCreating, isTesting } = useCreateContact(
        validationContainerRef,
        contactInfo,
        onCancel,
        setError,
        teamId
    );

    const handleChange = (contactUpdate: Partial<Contact>): void => {
        setContactInfo((prevState) => ({
            ...prevState,
            ...contactUpdate,
        }));
        setError(null);
    };

    const handleImport = (fileData: string, fileName: string): void => {
        try {
            const newContact = JSON.parse(fileData);

            if (typeof newContact !== "object" || newContact === null) {
                throw new Error("Must be a delivery channel object");
            }

            if (config?.contacts.every(({ type }) => type !== newContact.type)) {
                throw new Error(
                    `Type must be one of ${config?.contacts.map(({ type }) => type).join(", ")}`
                );
            }
            if (typeof newContact.value !== "string") {
                throw new Error("Value must be string");
            }

            handleChange(omitContact(newContact));
        } catch (e) {
            setError(`File ${fileName} cannot be converted to delivery channel. ${e.message}`);
        }
    };

    const areActionButtonsDisabled = isInvalidContactInfo || isCreating || isTesting;

    return (
        <Modal width={564} onClose={onCancel}>
            <Modal.Header sticky={false}>Delivery channel adding</Modal.Header>
            <Modal.Body>
                <ValidationContainer ref={validationContainerRef}>
                    <ContactEditForm contactInfo={contactInfo} onChange={handleChange} />
                </ValidationContainer>
            </Modal.Body>
            <Modal.Footer panel sticky>
                <ModalError message={error} maxWidth="450px" />
                <RowStack gap={2} block baseline>
                    <Button
                        use="primary"
                        loading={isCreating}
                        disabled={areActionButtonsDisabled}
                        onClick={() => handleCreateContact()}
                    >
                        Add
                    </Button>
                    <Button
                        disabled={areActionButtonsDisabled}
                        loading={isTesting}
                        onClick={() => handleCreateContact(true)}
                    >
                        Add and test
                    </Button>
                    <Fill />
                    <FileLoader onLoad={handleImport}>Import delivery channel</FileLoader>
                </RowStack>
            </Modal.Footer>
        </Modal>
    );
};

export default NewContactModal;
