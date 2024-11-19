import React, { useState, useRef, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Button } from "@skbkontur/react-ui";
import { useSaveTrigger } from "../hooks/useSaveTrigger";
import { Trigger, TriggerSource } from "../Domain/Trigger";
import { getPageLink } from "../Domain/Global";
import RouterLink from "../Components/RouterLink/RouterLink";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import TriggerEditForm from "../Components/TriggerEditForm/TriggerEditForm";
import { ColumnStack, RowStack, Fit } from "../Components/ItemsStack/ItemsStack";
import { useValidateTarget } from "../hooks/useValidateTarget";
import { TriggerSaveWarningModal } from "../Components/TriggerSaveWarningModal/TriggerSaveWarningModal";
import { setDocumentTitle } from "../helpers/setDocumentTitle";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { ConfigState, TriggerFormState, UIState } from "../store/selectors";
import { setError } from "../store/Reducers/UIReducer.slice";
import { useGetTagsQuery } from "../services/TagsApi";
import { useGetTriggerQuery } from "../services/TriggerApi";
import {
    setIsSaveButtonDisabled,
    setIsSaveModalVisible,
} from "../store/Reducers/TriggerFormReducer.slice";

type Props = RouteComponentProps<{ id: string }>;

const TriggerEditContainer = (props: Props) => {
    const [trigger, setTrigger] = useState<Trigger | undefined>(undefined);
    const { config } = useAppSelector(ConfigState);
    const { validationResult, isSaveModalVisible } = useAppSelector(TriggerFormState);
    const { isLoading, error } = useAppSelector(UIState);
    const dispatch = useAppDispatch();

    const { id } = props.match.params;
    const { data: sourceTrigger } = useGetTriggerQuery({
        triggerId: id,
    });
    const { data: tags } = useGetTagsQuery();

    const validationContainer = useRef<ValidationContainer>(null);
    const validateTarget = useValidateTarget(dispatch, props.history);
    const saveTrigger = useSaveTrigger(props.history);

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

    useEffect(() => {
        setDocumentTitle("Edit trigger");

        if (sourceTrigger) {
            setTrigger(sourceTrigger);
        } else {
            setTrigger(undefined);
        }
    }, [sourceTrigger]);

    return (
        <Layout loading={isLoading} error={error}>
            <LayoutContent>
                <TriggerSaveWarningModal
                    isOpen={isSaveModalVisible}
                    onClose={() => dispatch(setIsSaveModalVisible(false))}
                    onSave={() => {
                        saveTrigger(trigger);
                        dispatch(setIsSaveModalVisible(false));
                    }}
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

export default TriggerEditContainer;
