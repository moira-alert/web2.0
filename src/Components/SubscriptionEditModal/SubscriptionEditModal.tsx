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
import {
    useDeleteSubscriptionMutation,
    useTestSubscriptionMutation,
    useUpdateSubscriptionMutation,
} from "../../services/SubscriptionsApi";
import { useParams } from "react-router";
import ModalError from "../ModalError/ModalError";

type Props = {
    subscription: Subscription;
    tags: Array<string>;
    contacts: Array<Contact>;
    onChange: (subscription: Partial<Subscription>) => void;
    onCancel: () => void;
};

const SubscriptionEditModal: React.FC<Props> = ({
    subscription,
    tags,
    contacts,
    onChange,
    onCancel,
}) => {
    const validationContainerRef = useRef<ValidationContainer>(null);

    const [error, setError] = useState<string | null>(null);
    const { teamId } = useParams<{ teamId: string }>();
    const [
        updateSubscription,
        { isLoading: isUpdatingSubscription },
    ] = useUpdateSubscriptionMutation();
    const [testSubscription, { isLoading: isTestingSubscription }] = useTestSubscriptionMutation();
    const [
        deleteSubscription,
        { isLoading: isDeletingSubscription },
    ] = useDeleteSubscriptionMutation();

    const handleChange = (subscription: Partial<Subscription>): void => {
        onChange(subscription);
    };

    const handleUpdateSubscription = async (testAfterUpdate?: boolean): Promise<void> => {
        if (!(await validateForm())) {
            return;
        }
        try {
            await updateSubscription({ ...subscription, isTeamSubscription: !!teamId }).unwrap();
            if (testAfterUpdate) {
                await testSubscription(subscription.id).unwrap();
            }
            onCancel();
        } catch (error) {
            setError(error);
        }
    };

    const handleDelete = async (): Promise<void> => {
        try {
            await deleteSubscription({
                id: subscription.id,
                isTeamSubscription: !!teamId,
            }).unwrap();
            onCancel();
        } catch (error) {
            setError(error);
        }
    };

    const validateForm = async (): Promise<boolean> => {
        if (!validationContainerRef.current) {
            return true;
        }
        return validationContainerRef.current.validate();
    };

    const getFileName = (): string => {
        const contactValues = subscription.contacts.map((contactId) => {
            const contact = contacts.find((c) => c.id === contactId);
            return contact ? contact.value : contactId;
        });

        return `subscription ${contactValues.join(" ")} ${subscription.tags
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
                    <ResourceIDBadge title={"Subscription id:"} id={subscription.id} />
                    <ValidationContainer ref={validationContainerRef}>
                        <SubscriptionEditor
                            subscription={subscription}
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
                            loading={isTestingSubscription && isUpdatingSubscription}
                            onClick={() => handleUpdateSubscription(true)}
                        >
                            Save and test
                        </Button>
                        <FileExport
                            isButton
                            title={getFileName()}
                            data={omitSubscription(subscription)}
                        >
                            Export
                        </FileExport>
                        <Fill />
                        <Button
                            use="danger"
                            disabled={isActionButtonsDisabled}
                            loading={isDeletingSubscription}
                            onClick={handleDelete}
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
