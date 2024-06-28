import React, { useState, useRef } from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Modal } from "@skbkontur/react-ui/components/Modal";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Fill, RowStack } from "@skbkontur/react-stack-layout";
import { Subscription } from "../../Domain/Subscription";
import { Contact } from "../../Domain/Contact";
import { omitSubscription } from "../../helpers/omitTypes";
import SubscriptionEditor from "../SubscriptionEditor/SubscriptionEditor";
import FileExport from "../FileExport/FileExport";
import { ResourceIDBadge } from "../ResourceIDBadge/ResourceIDBadge";
import { useParams } from "react-router";
import ModalError from "../ModalError/ModalError";
import { useUpdateSubscription } from "../../hooks/useUpdateSubscription";
import { useDeleteSubscription } from "../../hooks/useDeleteSubscription";

type Props = {
    subscription: Subscription;
    tags: Array<string>;
    contacts: Array<Contact>;
    onCancel: () => void;
};

const SubscriptionEditModal: React.FC<Props> = ({ subscription, tags, contacts, onCancel }) => {
    const validationContainerRef = useRef<ValidationContainer>(null);
    const [subscriptionToEdit, setSubscriptionToEdit] = useState<Subscription>(subscription);
    const [error, setError] = useState<string | null>(null);
    const { teamId } = useParams<{ teamId: string }>();
    const {
        handleUpdateSubscription,
        isUpdatingSubscription,
        isTestingSubscription,
    } = useUpdateSubscription(
        validationContainerRef,
        subscriptionToEdit,
        onCancel,
        setError,
        teamId
    );
    const { handleDeleteSubscription, isDeletingSubscription } = useDeleteSubscription(
        subscriptionToEdit,
        onCancel,
        setError,
        teamId
    );

    const handleChange = (subscription: Partial<Subscription>): void => {
        setSubscriptionToEdit((prev) => ({ ...prev, ...subscription }));
    };

    const getFileName = (): string => {
        const contactValues = subscriptionToEdit.contacts.map((contactId) => {
            const contact = contacts.find((c) => c.id === contactId);
            return contact ? contact.value : contactId;
        });

        return `subscription ${contactValues.join(" ")} ${subscriptionToEdit.tags
            .slice(0, 5)
            .map((t) => t.slice(0, 8))
            .join(" ")}`;
    };

    const isActionButtonsDisabled =
        isUpdatingSubscription || isTestingSubscription || isDeletingSubscription;

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Modal onClose={onCancel}>
                <Modal.Header sticky={false}>Subscription editing</Modal.Header>
                <Modal.Body>
                    <ResourceIDBadge title={"Subscription id:"} id={subscriptionToEdit.id} />
                    <ValidationContainer ref={validationContainerRef}>
                        <SubscriptionEditor
                            subscription={subscriptionToEdit}
                            onChange={handleChange}
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
                            loading={isUpdatingSubscription}
                            onClick={() => handleUpdateSubscription()}
                        >
                            Save
                        </Button>
                        <Button
                            disabled={isActionButtonsDisabled}
                            loading={isTestingSubscription}
                            onClick={() => handleUpdateSubscription(true)}
                        >
                            Save and test
                        </Button>
                        <FileExport
                            isButton
                            title={getFileName()}
                            data={omitSubscription(subscriptionToEdit)}
                        >
                            Export
                        </FileExport>
                        <Fill />
                        <Button
                            use="danger"
                            disabled={isActionButtonsDisabled}
                            loading={isDeletingSubscription}
                            onClick={handleDeleteSubscription}
                        >
                            Delete
                        </Button>
                    </RowStack>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default SubscriptionEditModal;
