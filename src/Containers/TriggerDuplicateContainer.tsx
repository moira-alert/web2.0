import React, { useState, useRef, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Button } from "@skbkontur/react-ui/components/Button";
import { useSaveTrigger } from "../hooks/useSaveTrigger";
import TriggerSource, { Trigger } from "../Domain/Trigger";
import { getPageLink } from "../Domain/Global";
import RouterLink from "../Components/RouterLink/RouterLink";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import TriggerEditForm from "../Components/TriggerEditForm/TriggerEditForm";
import { ColumnStack, RowStack, Fit } from "../Components/ItemsStack/ItemsStack";
import { setError } from "../store/Reducers/UIReducer.slice";
import { useValidateTarget } from "../hooks/useValidateTarget";
import { TriggerSaveWarningModal } from "../Components/TriggerSaveWarningModal/TriggerSaveWarningModal";
import { setDocumentTitle } from "../helpers/setDocumentTitle";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { ConfigState, TriggerFormState, UIState } from "../store/selectors";
import { useGetTriggerQuery } from "../services/TriggerApi";
import { useGetTagsQuery } from "../services/TagsApi";
import {
    setIsSaveModalVisible,
    setIsSaveButtonDisabled,
} from "../store/Reducers/TriggerFormReducer.slice";

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

const TriggerDuplicateContainer = () => {
    const { id = "" } = useParams<{ id: string }>();
    const { config } = useAppSelector(ConfigState);
    const { isSaveModalVisible, validationResult } = useAppSelector(TriggerFormState);
    const { isLoading, error } = useAppSelector(UIState);
    const dispatch = useAppDispatch();
    const { data: sourceTrigger } = useGetTriggerQuery({ triggerId: id });
    const { data: tags } = useGetTagsQuery();
    const [trigger, setTrigger] = useState<Partial<Trigger> | undefined>(undefined);

    const validationContainer = useRef<ValidationContainer>(null);
    const validateTarget = useValidateTarget(dispatch);
    const saveTrigger = useSaveTrigger();

    const handleSubmit = async () => {
        const isFormValid = await validationContainer.current?.validate();
        if (!isFormValid) {
            return;
        }

        trigger?.trigger_source === TriggerSource.GRAPHITE_LOCAL
            ? validateTarget(trigger)
            : saveTrigger(trigger);
    };

    const handleChange = (update: Partial<Trigger>) => {
        if (!trigger) return;

        if (update.trigger_source) {
            setTrigger((prev) => {
                if (!prev) return;
                return { ...prev, cluster_id: null, ...update };
            });
            dispatch(setIsSaveButtonDisabled(false));
            return;
        }

        setTrigger((prev) => ({ ...prev, ...update }));
        dispatch(setError(null));

        if (update.targets) {
            dispatch(setIsSaveButtonDisabled(false));
        }
    };

    useEffect(() => {
        setDocumentTitle("Duplicate trigger");
        if (sourceTrigger) {
            setTrigger(cleanTrigger(sourceTrigger));
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
                                            validationResult={validationResult}
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
                                        <RouterLink to={getPageLink("trigger", id)}>
                                            <Button component="a">Cancel</Button>
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

export default TriggerDuplicateContainer;
