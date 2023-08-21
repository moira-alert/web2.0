import React, { useState, useRef, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Button } from "@skbkontur/react-ui/components/Button";
import { useSaveTrigger, useTriggerFormContainer } from "../hooks/useSaveTrigger";
import MoiraApi from "../Api/MoiraApi";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import { Trigger } from "../Domain/Trigger";
import { getPageLink } from "../Domain/Global";
import { Config } from "../Domain/Config";
import RouterLink from "../Components/RouterLink/RouterLink";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import TriggerEditForm from "../Components/TriggerEditForm/TriggerEditForm";
import { ColumnStack, RowStack, Fit } from "../Components/ItemsStack/ItemsStack";
import {
    ActionType,
    useTriggerFormContainerReducer,
} from "../hooks/useTriggerFormContainerReducer";
import { useValidateTrigger } from "../hooks/useValidateTrigger";
import { SaveTriggerModal } from "../Components/SaveTriggerModal/SaveTriggerModal";

// TODO check id wasn't undefined
type Props = RouteComponentProps<{ id?: string }> & { moiraApi: MoiraApi };

const TriggerDuplicateContainer = (props: Props) => {
    const [state, dispatch] = useTriggerFormContainerReducer();
    const [trigger, setTrigger] = useState<Partial<Trigger> | undefined>(undefined);
    const [tags, setTags] = useState<string[] | undefined>(undefined);
    const [config, setConfig] = useState<Config | undefined>(undefined);

    const validationContainer = useRef<ValidationContainer>(null);
    const validateTrigger = useValidateTrigger(props.moiraApi, dispatch, validationContainer);
    const saveTrigger = useSaveTrigger(props.moiraApi, dispatch, props.history);

    const cleanTrigger = (sourceTrigger: Trigger): Partial<Trigger> => {
        const trigger: Partial<Trigger> = { ...sourceTrigger };

        delete trigger.id;
        delete trigger.last_check;
        delete trigger.throttling;

        return {
            ...trigger,
            name: `${trigger.name} (copy)`,
            sched: trigger.sched
                ? { ...trigger.sched, tzOffset: new Date().getTimezoneOffset() }
                : undefined,
        };
    };

    const handleSubmit = async () =>
        trigger?.is_remote ? saveTrigger(trigger) : validateTrigger(trigger);

    const handleChange = (update: Partial<Trigger>, targetIndex?: number) => {
        if (!trigger) {
            return;
        }

        if (update.is_remote) {
            dispatch({ type: ActionType.setIsSaveButtonDisabled, payload: false });
        }

        setTrigger({ ...trigger, ...update });
        dispatch({ type: ActionType.setError, payload: null });
        if (update.targets) {
            dispatch({ type: ActionType.setIsSaveButtonDisabled, payload: false });
            dispatch({ type: ActionType.resetTargetValidationState, payload: targetIndex });
        }
    };

    const getData = async () => {
        const { id } = props.match.params;
        if (typeof id !== "string") {
            dispatch({ type: ActionType.setError, payload: "Wrong trigger id" });
            dispatch({ type: ActionType.setIsLoading, payload: false });
            return;
        }

        try {
            const [sourceTrigger, { list }, config] = await Promise.all([
                props.moiraApi.getTrigger(id),
                props.moiraApi.getTagList(),
                props.moiraApi.getConfig(),
            ]);

            const trigger = cleanTrigger(sourceTrigger);
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
        document.title = "Moira - Duplicate trigger";
        getData();
    }, []);

    return (
        <Layout loading={state.isLoading} error={state.error}>
            <LayoutContent>
                <SaveTriggerModal
                    state={state}
                    dispatch={dispatch}
                    action={() => saveTrigger(trigger)}
                />
                <LayoutTitle>Duplicate trigger</LayoutTitle>
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
                                        <Button use="primary" onClick={handleSubmit}>
                                            Duplicate trigger
                                        </Button>
                                    </Fit>
                                    <Fit>
                                        <RouterLink
                                            to={getPageLink(
                                                "trigger",
                                                props.match?.params?.id || ""
                                            )}
                                        >
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

export default withMoiraApi(TriggerDuplicateContainer);
