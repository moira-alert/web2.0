import React, { useState, useRef } from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Modal } from "@skbkontur/react-ui/components/Modal";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Fill, RowStack } from "@skbkontur/react-stack-layout";
import { Contact } from "../../Domain/Contact";
import { omitSubscription } from "../../helpers/omitTypes";
import SubscriptionEditor, { SubscriptionInfo } from "../SubscriptionEditor/SubscriptionEditor";
import FileLoader from "../FileLoader/FileLoader";
import ModalError from "../ModalError/ModalError";
import { useParams } from "react-router";
import {
    useCreateUserSubscriptionMutation,
    useTestSubscriptionMutation,
} from "../../services/SubscriptionsApi";
import { useCreateTeamSubscriptionMutation } from "../../services/TeamsApi";

type Props = {
    subscription: SubscriptionInfo;
    tags: Array<string>;
    contacts: Array<Contact>;
    onChange: (subscriptionInfo: Partial<SubscriptionInfo>) => void;
    onCancel: () => void;
};

const CreateSubscriptionModal: React.FC<Props> = ({
    subscription,
    tags,
    contacts,
    onChange,
    onCancel,
}) => {
    const [error, setError] = useState<string | null>(null);
    const validationContainerRef = useRef<ValidationContainer>(null);
    const { teamId } = useParams<{ teamId: string }>();
    const [
        createUserSubscription,
        { isLoading: isCreatingUserSubscription },
    ] = useCreateUserSubscriptionMutation();
    const [
        createTeamSubscription,
        { isLoading: isCreatingTeamSubscription },
    ] = useCreateTeamSubscriptionMutation();
    const [testSubscription, { isLoading: isTestingSubscription }] = useTestSubscriptionMutation();

    const handleChange = (subscription: Partial<SubscriptionInfo>): void => {
        onChange(subscription);
        setError(null);
    };

    const validateForm = async (): Promise<boolean> => {
        if (!validationContainerRef.current) {
            return true;
        }
        return validationContainerRef.current.validate();
    };

    const handleCreate = async (testAfterCreation?: boolean): Promise<void> => {
        if (!(await validateForm())) {
            return;
        }
        try {
            const createdSubscription = teamId
                ? await createTeamSubscription({ ...subscription, teamId }).unwrap()
                : await createUserSubscription(subscription).unwrap();
            if (testAfterCreation) {
                await testSubscription(createdSubscription.id).unwrap();
            }
            onCancel();
        } catch (error) {
            setError(error);
        }
    };

    const handleImport = (fileData: string, fileName: string): void => {
        try {
            const importedSubscription = JSON.parse(fileData);
            if (typeof importedSubscription === "object" && importedSubscription !== null) {
                handleChange(omitSubscription(importedSubscription));
            } else {
                throw new Error("Must be a subscription object");
            }
        } catch (e) {
            setError(`File ${fileName} cannot be converted to subscription. ${e.message}`);
        }
    };

    const isActionButtonsDisabled =
        isCreatingTeamSubscription || isCreatingUserSubscription || isTestingSubscription;

    return (
        <Modal onClose={onCancel}>
            <Modal.Header sticky={false}>Subscription adding</Modal.Header>
            <Modal.Body>
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
                        loading={isCreatingTeamSubscription || isCreatingUserSubscription}
                        onClick={() => handleCreate()}
                    >
                        Add
                    </Button>
                    <Button
                        disabled={isActionButtonsDisabled}
                        loading={
                            isTestingSubscription &&
                            (isCreatingTeamSubscription || isCreatingUserSubscription)
                        }
                        onClick={() => handleCreate(true)}
                    >
                        Add and test
                    </Button>
                    <Fill />
                    <FileLoader onLoad={handleImport}>Import subscription</FileLoader>
                </RowStack>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateSubscriptionModal;
