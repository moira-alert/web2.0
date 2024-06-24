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
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { ConfigState } from "../../store/selectors";
import { useCreateUserContactMutation, useTestContactMutation } from "../../services/ContactApi";
import { useCreateTeamContactMutation } from "../../services/TeamsApi";
import { useParams } from "react-router";
import { normalizeContactValueForApi } from "../../Domain/Contact";
import { BaseApi } from "../../services/BaseApi";

interface INewContactModalProps {
    onCancel: () => void;
}

const NewContactModal: FC<INewContactModalProps> = ({ onCancel }) => {
    const [contactInfo, setContactInfo] = useState<Partial<Contact> | null>(null);
    const { config } = useAppSelector(ConfigState);
    const { teamId } = useParams<{ teamId: string }>();
    const [
        createUserContact,
        { isLoading: isUserContactCreating },
    ] = useCreateUserContactMutation();
    const [
        createTeamContact,
        { isLoading: isTeamContactCreating },
    ] = useCreateTeamContactMutation();
    const [testContact, { isLoading: isTesting }] = useTestContactMutation();
    const [error, setError] = useState<string | null>(null);
    const validationContainerRef = useRef<ValidationContainer>(null);
    const dispatch = useAppDispatch();

    const handleChange = (contactUpdate: Partial<Contact>): void => {
        setContactInfo((prevState) => ({
            ...prevState,
            ...contactUpdate,
        }));
        setError(null);
    };

    const handleCreateContact = async (testAfterCreation?: boolean): Promise<void> => {
        if (!(await validateForm()) || !contactInfo || !contactInfo.value || !contactInfo.type) {
            return;
        }

        const { name, type, value } = contactInfo;

        const requestContact = {
            value: normalizeContactValueForApi(type, value),
            type,
            name,
        };

        try {
            const createdContact = teamId
                ? await createTeamContact({
                      teamId,
                      handleLoadingLocally: true,
                      handleErrorLocally: true,
                      ...requestContact,
                  }).unwrap()
                : await createUserContact({
                      handleLoadingLocally: true,
                      handleErrorLocally: true,
                      ...requestContact,
                  }).unwrap();

            if (testAfterCreation) {
                await testContact({
                    id: createdContact.id,
                    handleLoadingLocally: true,
                    handleErrorLocally: true,
                }).unwrap();
            }
            dispatch(BaseApi.util.invalidateTags(teamId ? ["TeamSettings"] : ["UserSettings"]));

            onCancel();
        } catch (error) {
            setError(error);
        }
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

    const validateForm = async (): Promise<boolean> => {
        if (!validationContainerRef.current) {
            return true;
        }
        return validationContainerRef.current.validate();
    };

    const areAddButtonsDisabled =
        !contactInfo?.value ||
        !contactInfo?.type ||
        isUserContactCreating ||
        isTeamContactCreating ||
        isTesting;

    return (
        <Modal onClose={onCancel}>
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
                        loading={isUserContactCreating || isTeamContactCreating}
                        disabled={areAddButtonsDisabled}
                        onClick={() => handleCreateContact()}
                    >
                        Add
                    </Button>
                    <Button
                        disabled={areAddButtonsDisabled}
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
