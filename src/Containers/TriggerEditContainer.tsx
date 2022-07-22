import React, { useState, useRef, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Button } from "@skbkontur/react-ui";
import TrashIcon from "@skbkontur/react-icons/Trash";
import { useTriggerFormContainer } from "../hooks/useTriggerFormContainer";
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

type Props = RouteComponentProps<{ id?: string }> & { moiraApi: MoiraApi };

const TriggerEditContainer = (props: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isDeleteTriggerDialogOpen, setIsDeleteTriggerDialogOpen] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [trigger, setTrigger] = useState<Trigger | undefined>(undefined);
    const [tags, setTags] = useState<string[] | undefined>(undefined);
    const [config, setConfig] = useState<Config | undefined>(undefined);

    const {
        validationResult,
        setValidationResult,
        validateTrigger,
        updateTrigger,
    } = useTriggerFormContainer(props.moiraApi);

    const validationContainer = useRef<ValidationContainer>(null);

    const handleSubmit = async () => {
        if (!trigger) {
            return;
        }

        setIsLoading(true);

        const updatedTrigger = updateTrigger(trigger);
        const isTriggerValid = await validateTrigger(validationContainer, updatedTrigger);
        if (!isTriggerValid) {
            setIsLoading(false);
            return;
        }

        try {
            await props.moiraApi.setTrigger(trigger.id, updatedTrigger);
            props.history.push(getPageLink("trigger", updatedTrigger.id));
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (update: Partial<Trigger>, targetIndex?: number) => {
        if (!trigger) {
            return;
        }

        setTrigger({ ...trigger, ...update });
        setError(undefined);
        if (update.targets) {
            const newTargets =
                validationResult?.targets.map((item, i) =>
                    i === targetIndex ? undefined : item
                ) ?? [];
            setValidationResult({ targets: newTargets });
        }
    };

    const deleteTrigger = async (id: string) => {
        setIsLoading(true);
        try {
            await props.moiraApi.delTrigger(id);
            props.history.push(getPageLink("index"));
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    const getData = async () => {
        if (typeof props.match.params.id !== "string") {
            setError("Wrong trigger id");
            setIsLoading(false);
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
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Moira - Edit trigger";
        getData();
    }, []);

    return (
        <Layout loading={isLoading} error={error}>
            <LayoutContent>
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
                                            validationResult={validationResult}
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
                                            data-tid="Delete Trigger"
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
