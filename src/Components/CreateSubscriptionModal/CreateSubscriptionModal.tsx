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
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { BaseApi } from "../../services/BaseApi";
import { WholeWeek, createSchedule } from "../../Domain/Schedule";
import { ConfigState } from "../../store/selectors";

type Props = {
    tags: Array<string>;
    contacts: Array<Contact>;
    onCancel: () => void;
};

const CreateSubscriptionModal: React.FC<Props> = ({ tags, contacts, onCancel }) => {
    const [error, setError] = useState<string | null>(null);

    const { config } = useAppSelector(ConfigState);
    const isPlottingDefaultOn =
        !!config?.featureFlags.isPlottingDefaultOn && config.featureFlags.isPlottingAvailable;
    const [subscription, setSubscription] = useState<SubscriptionInfo>({
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
    const [
        createUserSubscription,
        { isLoading: isCreatingUserSubscription },
    ] = useCreateUserSubscriptionMutation();
    const [
        createTeamSubscription,
        { isLoading: isCreatingTeamSubscription },
    ] = useCreateTeamSubscriptionMutation();
    const [testSubscription, { isLoading: isTestingSubscription }] = useTestSubscriptionMutation();
    const dispatch = useAppDispatch();

    const handleChange = (subscription: Partial<SubscriptionInfo>): void => {
        setSubscription((prev) => ({ ...prev, ...subscription }));
        setError(null);
    };

    const validateForm = async (): Promise<boolean> => {
        if (!validationContainerRef.current) {
            return true;
        }
        return validationContainerRef.current.validate();
    };

    const handleCreate = async (testAfterCreation?: boolean): Promise<void> => {
        if (!(await validateForm()) || !subscription) {
            return;
        }
        try {
            const createdSubscription = teamId
                ? await createTeamSubscription({
                      ...subscription,
                      teamId,
                      handleErrorLocally: true,
                      handleLoadingLocally: true,
                  }).unwrap()
                : await createUserSubscription({
                      ...subscription,
                      handleErrorLocally: true,
                      handleLoadingLocally: true,
                  }).unwrap();
            if (testAfterCreation) {
                await testSubscription({
                    id: createdSubscription.id,
                    handleErrorLocally: true,
                    handleLoadingLocally: true,
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
                (
                <ValidationContainer ref={validationContainerRef}>
                    <SubscriptionEditor
                        subscription={subscription}
                        onChange={handleChange}
                        tags={tags}
                        contacts={contacts}
                    />
                </ValidationContainer>
                )
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
                        loading={isTestingSubscription}
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
