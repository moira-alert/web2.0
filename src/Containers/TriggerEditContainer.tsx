import React, { useState, useRef, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Button } from "@skbkontur/react-ui";
import TrashIcon from "@skbkontur/react-icons/Trash";
import { useSaveTrigger } from "../hooks/useSaveTrigger";
import MoiraApi from "../Api/MoiraApi";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import type { Trigger } from "../Domain/Trigger";
import { getPageLink } from "../Domain/Global";
import { Config } from "../Domain/Config";
import RouterLink from "../Components/RouterLink/RouterLink";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import TriggerEditForm from "../Components/TriggerEditForm/TriggerEditForm";
import { TriggerDeleteModal } from "../Components/TriggerDeleteModal/TriggerDeleteModal";
import { ColumnStack, RowStack, Fit } from "../Components/ItemsStack/ItemsStack";
import {
    resetTargetValidationState,
    setError,
    setIsLoading,
    setIsSaveButtonDisabled,
    setIsSaveModalVisible,
    useTriggerFormContainerReducer,
} from "../hooks/useTriggerFormContainerReducer";
import { useValidateTrigger } from "../hooks/useValidateTrigger";
import { TriggerSaveWarningModal } from "../Components/TriggerSaveWarningModal/TriggerSaveWarningModal";

type Props = RouteComponentProps<{ id?: string }> & { moiraApi: MoiraApi };

const TriggerEditContainer = (props: Props) => {
    const [state, dispatch] = useTriggerFormContainerReducer();
    const [isDeleteTriggerDialogOpen, setIsDeleteTriggerDialogOpen] = useState<boolean>(false);
    const [trigger, setTrigger] = useState<Trigger | undefined>(undefined);
    const [tags, setTags] = useState<string[] | undefined>(undefined);
    const [config, setConfig] = useState<Config | undefined>(undefined);

    const validationContainer = useRef<ValidationContainer>(null);
    const validateTrigger = useValidateTrigger(
        props.moiraApi,
        dispatch,
        validationContainer,
        props.history
    );
    const saveTrigger = useSaveTrigger(props.moiraApi, dispatch, props.history);

    const handleSubmit = async () =>
        trigger?.is_remote ? saveTrigger(trigger) : validateTrigger(trigger);

    const handleChange = (update: Partial<Trigger>, targetIndex?: number) => {
        if (!trigger) {
            return;
        }

        setTrigger({ ...trigger, ...update });
        dispatch(setError(null));

        if (update.is_remote) {
            dispatch(setIsSaveButtonDisabled(false));
        }

        if (update.targets) {
            dispatch(setIsSaveButtonDisabled(false));
            dispatch(resetTargetValidationState(targetIndex));
        }
    };

    const deleteTrigger = async (id: string) => {
        dispatch(setIsLoading(true));
        try {
            await props.moiraApi.delTrigger(id);
            props.history.push(getPageLink("index"));
        } catch (error) {
            dispatch(setError(error.message));
            dispatch(setIsLoading(false));
        }
    };

    const getData = async () => {
        if (typeof props.match.params.id !== "string") {
            dispatch(setError("Wrong trigger id"));
            dispatch(setIsLoading(false));
            return;
        }

        try {
            const [trigger, { list }, config] = await Promise.all([
                props.moiraApi.getTrigger(props.match.params.id),
                props.moiraApi.getTagList(),
                props.moiraApi.getConfig(),
            ]);

            setTrigger(trigger);
            setConfig(config);
            setTags(list);
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setIsLoading(false));
        }
    };

    useEffect(() => {
        document.title = "Moira - Edit trigger";
        dispatch(setIsLoading(true));
        getData();
    }, []);

    return (
        <Layout loading={state.isLoading} error={state.error}>
            <LayoutContent>
                <TriggerSaveWarningModal
                    isOpen={state.isSaveModalVisible}
                    onClose={() => dispatch(setIsSaveModalVisible(false))}
                    onSave={() => saveTrigger(trigger)}
                />
                <LayoutTitle>Edit trigger</LayoutTitle>
                {trigger && (
                    <form>
                        <ColumnStack block gap={6} horizontalAlign="stretch">
                            <Fit>
                                <ValidationContainer ref={validationContainer}>
                                    {config != null && (
                                        <TriggerEditForm
                                            data={trigger}
                                            tags={tags || []}
                                            remoteAllowed={config.remoteAllowed}
                                            onChange={handleChange}
                                            validationResult={state.validationResult}
                                        />
                                    )}
                                </ValidationContainer>
                            </Fit>
                            <Fit>
                                <RowStack gap={3} baseline>
                                    <Fit>
                                        <Button
                                            use="primary"
                                            onClick={handleSubmit}
                                            data-tid="Save Trigger"
                                            disabled={state.isSaveButtonDisabled}
                                        >
                                            Save trigger
                                        </Button>
                                    </Fit>
                                    <Fit>
                                        {isDeleteTriggerDialogOpen && (
                                            <TriggerDeleteModal
                                                triggerName={trigger.name}
                                                onClose={() => setIsDeleteTriggerDialogOpen(false)}
                                                onDelete={() => deleteTrigger(trigger.id)}
                                            />
                                        )}
                                        <Button
                                            use="link"
                                            icon={<TrashIcon />}
                                            onClick={() => setIsDeleteTriggerDialogOpen(true)}
                                            data-tid="Open Delete Modal"
                                        >
                                            Delete
                                        </Button>
                                    </Fit>
                                    <Fit>
                                        <RouterLink to={getPageLink("trigger", trigger.id)}>
                                            Cancel
                                        </RouterLink>
                                    </Fit>
                                </RowStack>
                            </Fit>
                        </ColumnStack>
                    </form>
                )}
            </LayoutContent>
        </Layout>
    );
};

export default withMoiraApi(TriggerEditContainer);
