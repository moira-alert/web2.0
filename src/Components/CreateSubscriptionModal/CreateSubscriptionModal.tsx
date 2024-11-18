import React, { useState, useRef } from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Modal } from "@skbkontur/react-ui/components/Modal";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Fill, RowStack } from "@skbkontur/react-stack-layout";
import { Contact } from "../../Domain/Contact";
import { omitSubscription } from "../../helpers/omitTypes";
import SubscriptionEditor from "../SubscriptionEditor/SubscriptionEditor";
import { SubscriptionCreateInfo } from "../../Domain/Subscription";
import FileLoader from "../FileLoader/FileLoader";
import ModalError from "../ModalError/ModalError";
import { useParams } from "react-router";
import { WholeWeek, createSchedule } from "../../Domain/Schedule";
import { useSelector } from "react-redux";
import { selectIsPlottingDefaultOn } from "../../store/Reducers/ConfigReducer.slice";
import { useCreateSubscription } from "../../hooks/useCreateSubscription";

type Props = {
    tags: Array<string>;
    contacts: Array<Contact>;
    onCancel: () => void;
};

const CreateSubscriptionModal: React.FC<Props> = ({ tags, contacts, onCancel }) => {
    const isPlottingDefaultOn = useSelector(selectIsPlottingDefaultOn);

    const [subscription, setSubscription] = useState<SubscriptionCreateInfo>({
        any_tags: false,
        sched: createSchedule(WholeWeek),
        tags: [],
        throttling: false,
        contacts: [],
        enabled: true,
        ignore_recoverings: false,
        ignore_warnings: false,
        plotting: {
            enabled: isPlottingDefaultOn,
            theme: "light",
        },
    });
    const validationContainerRef = useRef<ValidationContainer>(null);
    const { teamId } = useParams<{ teamId: string }>();
    const [error, setError] = useState<string | null>(null);
    const {
        handleCreateSubscription,
        isCreatingUserSubscription,
        isCreatingTeamSubscription,
        isTestingSubscription,
    } = useCreateSubscription(validationContainerRef, subscription, onCancel, setError, teamId);

    const handleChange = (subscription: Partial<SubscriptionCreateInfo>): void => {
        setSubscription((prev) => ({ ...prev, ...subscription }));
        setError(null);
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
                        onClick={() => handleCreateSubscription()}
                    >
                        Add
                    </Button>
                    <Button
                        disabled={isActionButtonsDisabled}
                        loading={isTestingSubscription}
                        onClick={() => handleCreateSubscription(true)}
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
