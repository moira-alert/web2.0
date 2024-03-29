import React, { useState, useRef, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Button } from "@skbkontur/react-ui";
import { useSaveTrigger } from "../hooks/useSaveTrigger";
import MoiraApi from "../Api/MoiraApi";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import { Trigger, TriggerSource } from "../Domain/Trigger";
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

type Props = RouteComponentProps<{ id?: string }> & { moiraApi: MoiraApi };

const TriggerEditContainer = (props: Props) => {
    const [state, dispatch] = useTriggerFormContainerReducer();
    const [trigger, setTrigger] = useState<Trigger | undefined>(undefined);
    const [tags, setTags] = useState<string[] | undefined>(undefined);
    const { config } = useAppSelector(ConfigState);

    const validationContainer = useRef<ValidationContainer>(null);
    const validateTarget = useValidateTarget(props.moiraApi, dispatch, props.history);
    const saveTrigger = useSaveTrigger(props.moiraApi, dispatch, props.history);

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
        if (update.trigger_source) {
            setTrigger((prev) => {
                if (!prev) return;
                return { ...prev, cluster_id: null, ...update };
            });
            dispatch(setIsSaveButtonDisabled(false));
            return;
        }
        setTrigger((prev) => {
            if (!prev) return;
            return { ...prev, ...update };
        });
        dispatch(setError(null));

        if (update.targets) {
            dispatch(setIsSaveButtonDisabled(false));
        }
    };

    const getData = async () => {
        if (typeof props.match.params.id !== "string") {
            dispatch(setError("Wrong trigger id"));
            dispatch(setIsLoading(false));
            return;
        }

        try {
            const [trigger, { list }] = await Promise.all([
                props.moiraApi.getTrigger(props.match.params.id),
                props.moiraApi.getTagList(),
            ]);

            setTrigger(trigger);
            setTags(list);
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setIsLoading(false));
        }
    };

    useEffect(() => {
        setDocumentTitle("Edit trigger");
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
                                            use="primary"
                                            onClick={handleSubmit}
                                            data-tid="Save Trigger"
                                            disabled={state.isSaveButtonDisabled}
                                        >
                                            Save trigger
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
