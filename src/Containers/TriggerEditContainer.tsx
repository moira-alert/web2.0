import React, { useState, useRef, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Button, Modal, Toast } from "@skbkontur/react-ui";
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
    ActionType,
    useTriggerFormContainerReducer,
} from "../hooks/useTriggerFormContainerReducer";

type Props = RouteComponentProps<{ id?: string }> & { moiraApi: MoiraApi };

const TriggerEditContainer = (props: Props) => {
    const [state, dispatch] = useTriggerFormContainerReducer();
    const [isDeleteTriggerDialogOpen, setIsDeleteTriggerDialogOpen] = useState<boolean>(false);
    const [trigger, setTrigger] = useState<Trigger | undefined>(undefined);
    const [tags, setTags] = useState<string[] | undefined>(undefined);
    const [config, setConfig] = useState<Config | undefined>(undefined);

    const validationContainer = useRef<ValidationContainer>(null);
    const saveTrigger = useSaveTrigger(props.moiraApi, validationContainer, dispatch);

    const handleSubmit = async () => saveTrigger(trigger);

    const handleChange = (update: Partial<Trigger>, targetIndex?: number) => {
        if (!trigger) {
            return;
        }

        setTrigger({ ...trigger, ...update });
        dispatch({ type: ActionType.setError, payload: undefined });
        if (update.targets) {
            dispatch({ type: ActionType.setIsSaveButtonDisabled, payload: false });
            const newTargets =
                state.validationResult?.targets.map((item, i) =>
                    i === targetIndex ? undefined : item
                ) ?? [];
            dispatch({ type: ActionType.setValidationResult, payload: { targets: newTargets } });
        }
    };

    const deleteTrigger = async (id: string) => {
        dispatch({ type: ActionType.setIsLoading, payload: true });
        try {
            await props.moiraApi.delTrigger(id);
            props.history.push(getPageLink("index"));
        } catch (error) {
            dispatch({ type: ActionType.setError, payload: error.message });
            dispatch({ type: ActionType.setIsLoading, payload: false });
        }
    };

    const getData = async () => {
        if (typeof props.match.params.id !== "string") {
            dispatch({ type: ActionType.setError, payload: "Wrong trigger id" });
            dispatch({ type: ActionType.setIsLoading, payload: false });
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
            dispatch({ type: ActionType.setError, payload: error.message });
        } finally {
            dispatch({ type: ActionType.setIsLoading, payload: false });
        }
    };

    useEffect(() => {
        document.title = "Moira - Edit trigger";
        getData();
    }, []);

    return (
        <Layout loading={state.isLoading} error={state.error}>
            <LayoutContent>
                {state.isSaveModalVisible && (
                    <Modal
                        onClose={() =>
                            dispatch({ type: ActionType.setIsSaveModalVisible, payload: false })
                        }
                    >
                        <Modal.Header>Test</Modal.Header>
                        <Modal.Body>
                            The Graphite function you&apos;ve used makes no sense in Moira or may
                            generate unwanted side effects. Are you sure you want to save this
                            trigger?
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                onClick={async () => {
                                    const updatedTrigger = updateTrigger(trigger);

                                    dispatch({ type: ActionType.setIsLoading, payload: true });
                                    try {
                                        await props.moiraApi.setTrigger(trigger.id, updatedTrigger);
                                        props.history.push(getPageLink("trigger", trigger.id));
                                    } catch (error) {
                                        dispatch({
                                            type: ActionType.setError,
                                            payload: error.message,
                                        });
                                    } finally {
                                        dispatch({ type: ActionType.setIsLoading, payload: false });
                                    }
                                }}
                                use="primary"
                            >
                                Save
                            </Button>
                            <Button
                                onClick={() =>
                                    dispatch({
                                        type: ActionType.setIsSaveModalVisible,
                                        payload: false,
                                    })
                                }
                            >
                                Cancel
                            </Button>
                        </Modal.Footer>
                    </Modal>
                )}
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
