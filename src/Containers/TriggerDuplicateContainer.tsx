import React, { useState, useRef, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Button } from "@skbkontur/react-ui/components/Button";
import { useSaveTrigger } from "../hooks/useSaveTrigger";
import MoiraApi from "../Api/MoiraApi";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import TriggerSource, { Trigger } from "../Domain/Trigger";
import { getPageLink } from "../Domain/Global";
import RouterLink from "../Components/RouterLink/RouterLink";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import TriggerEditForm from "../Components/TriggerEditForm/TriggerEditForm";
import { ColumnStack, RowStack, Fit } from "../Components/ItemsStack/ItemsStack";
import {
    setError,
    setIsLoading,
    setIsSaveButtonDisabled,
    setIsSaveModalVisible,
    useTriggerFormContainerReducer,
} from "../hooks/useTriggerFormContainerReducer";
import { useValidateTarget } from "../hooks/useValidateTarget";
import { TriggerSaveWarningModal } from "../Components/TriggerSaveWarningModal/TriggerSaveWarningModal";
import { setDocumentTitle } from "../helpers/setDocumentTitle";
import { useAppSelector } from "../store/hooks";
import { ConfigState } from "../store/selectors";

// TODO check id wasn't undefined
type Props = RouteComponentProps<{ id?: string }> & { moiraApi: MoiraApi };

const TriggerDuplicateContainer = (props: Props) => {
    const { config } = useAppSelector(ConfigState);
    const [state, dispatch] = useTriggerFormContainerReducer();
    const [trigger, setTrigger] = useState<Partial<Trigger> | undefined>(undefined);
    const [tags, setTags] = useState<string[] | undefined>(undefined);

    const validationContainer = useRef<ValidationContainer>(null);
    const validateTarget = useValidateTarget(props.moiraApi, dispatch, props.history);
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

    const handleSubmit = async () => {
        const isFormValid = await validationContainer.current?.validate();
        if (!isFormValid) {
            return;
        }

        // Backend validation looks for errors in relation to the current version of Carbon, but for the remote target, the expression should be checked in relation to the remote source.
        trigger?.trigger_source === TriggerSource.GRAPHITE_LOCAL
            ? validateTarget(trigger)
            : saveTrigger(trigger);
    };

    const handleChange = (update: Partial<Trigger>) => {
        if (!trigger) {
            return;
        }

        if (update.trigger_source) {
            setTrigger((prev) => {
                if (!prev) return;
                return { ...prev, cluster_id: null, ...update };
            });
            dispatch(setIsSaveButtonDisabled(false));
            return;
        }
        setTrigger((prev) => {
            return { ...prev, ...update };
        });
        dispatch(setError(null));

        if (update.targets) {
            dispatch(setIsSaveButtonDisabled(false));
        }
    };

    const getData = async () => {
        const { id } = props.match.params;
        if (typeof id !== "string") {
            dispatch(setError("Wrong trigger id"));
            dispatch(setIsLoading(false));
            return;
        }

        try {
            const [sourceTrigger, { list }] = await Promise.all([
                props.moiraApi.getTrigger(id),
                props.moiraApi.getTagList(),
            ]);

            const trigger = cleanTrigger(sourceTrigger);
            setTrigger(trigger);
            setTags(list);
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setIsLoading(false));
        }
    };

    useEffect(() => {
        setDocumentTitle("Duplicate trigger");
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
                                            metricSourceClusters={config.metric_source_clusters}
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
                                            data-tid="Duplicate Trigger"
                                            use="primary"
                                            onClick={handleSubmit}
                                        >
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
