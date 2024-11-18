import React, { useState, useRef, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Fill, RowStack as LayoutRowStack } from "@skbkontur/react-stack-layout";
import { useSaveTrigger } from "../hooks/useSaveTrigger";
import { DEFAULT_TRIGGER_TTL, Trigger, TriggerSource } from "../Domain/Trigger";
import { getPageLink } from "../Domain/Global";
import { Status } from "../Domain/Status";
import { DaysOfWeek } from "../Domain/Schedule";
import { omitTrigger } from "../helpers/omitTypes";
import RouterLink from "../Components/RouterLink/RouterLink";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import TriggerEditForm from "../Components/TriggerEditForm/TriggerEditForm";
import { RowStack, ColumnStack, Fit } from "../Components/ItemsStack/ItemsStack";
import FileLoader from "../Components/FileLoader/FileLoader";
import { useValidateTarget } from "../hooks/useValidateTarget";
import { TriggerSaveWarningModal } from "../Components/TriggerSaveWarningModal/TriggerSaveWarningModal";
import { setDocumentTitle } from "../helpers/setDocumentTitle";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { ConfigState, TriggerFormState, UIState } from "../store/selectors";
import { useGetTagsQuery } from "../services/TagsApi";
import { setError } from "../store/Reducers/UIReducer.slice";
import {
    setIsSaveModalVisible,
    setIsSaveButtonDisabled,
} from "../store/Reducers/TriggerFormReducer.slice";

const defaultTrigger: Partial<Trigger> = {
    name: "",
    desc: "",
    targets: [""],
    tags: [],
    patterns: [],
    expression: "",
    ttl: DEFAULT_TRIGGER_TTL,
    ttl_state: Status.NODATA,
    sched: {
        startOffset: 0,
        endOffset: 1439,
        tzOffset: new Date().getTimezoneOffset(),
        days: [
            { enabled: true, name: DaysOfWeek.Mon },
            { enabled: true, name: DaysOfWeek.Tue },
            { enabled: true, name: DaysOfWeek.Wed },
            { enabled: true, name: DaysOfWeek.Thu },
            { enabled: true, name: DaysOfWeek.Fri },
            { enabled: true, name: DaysOfWeek.Sat },
            { enabled: true, name: DaysOfWeek.Sun },
        ],
    },
    trigger_source: TriggerSource.GRAPHITE_LOCAL,
    cluster_id: "default",
    error_value: null,
    warn_value: null,
    trigger_type: "rising",
    mute_new_metrics: false,
    alone_metrics: {},
};

const TriggerAddContainer = (props: RouteComponentProps) => {
    const { config } = useAppSelector(ConfigState);
    const { validationResult, isSaveModalVisible } = useAppSelector(TriggerFormState);
    const { isLoading, error } = useAppSelector(UIState);
    const dispatch = useAppDispatch();
    const [trigger, setTrigger] = useState<Partial<Trigger>>(defaultTrigger);
    const validationContainer = useRef<ValidationContainer>(null);
    const { data: tags } = useGetTagsQuery();
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
        if (!trigger) {
            return;
        }
        if (update.trigger_source) {
            setTrigger((prev) => {
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

    const handleFileImport = (fileData: string, fileName: string) => {
        try {
            const trigger = JSON.parse(fileData);

            if (typeof trigger !== "object" && trigger != null) {
                throw new Error("Must be an object");
            }

            handleChange(omitTrigger(trigger));
        } catch (error) {
            dispatch(setError(`File ${fileName} cannot be converted to trigger. ${error.message}`));
        }
    };

    const setTriggerWithSearchTags = () => {
        const localDataString = localStorage.getItem("moiraSettings");
        const { tags: localTags } = localDataString ? JSON.parse(localDataString) : { tags: [] };

        setTrigger((prev) => {
            return { ...prev, tags: localTags };
        });
    };

    useEffect(() => {
        setDocumentTitle("Add trigger");
        setTriggerWithSearchTags();
    }, []);

    return (
        <Layout loading={isLoading} error={error}>
            <LayoutContent>
                <TriggerSaveWarningModal
                    isOpen={isSaveModalVisible}
                    onClose={() => dispatch(setIsSaveModalVisible(false))}
                    onSave={() => saveTrigger(trigger)}
                />
                <LayoutRowStack baseline block gap={6} style={{ maxWidth: "800px" }}>
                    <Fill>
                        <LayoutTitle>Add trigger</LayoutTitle>
                    </Fill>
                    <FileLoader onLoad={handleFileImport}>Import</FileLoader>
                </LayoutRowStack>
                {trigger && (
                    <form>
                        <ColumnStack block gap={4}>
                            <Fit>
                                <ValidationContainer ref={validationContainer}>
                                    {config != null && (
                                        <TriggerEditForm
                                            data={trigger}
                                            remoteAllowed={config.remoteAllowed}
                                            metricSourceClusters={config.metric_source_clusters}
                                            tags={tags || []}
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
                                            data-tid="Add Trigger"
                                        >
                                            Add trigger
                                        </Button>
                                    </Fit>
                                    <Fit>
                                        <RouterLink to={getPageLink("index")}>Cancel</RouterLink>
                                    </Fit>
                                </RowStack>
                            </Fit>
                            <Fit style={{ height: `50px` }} />
                        </ColumnStack>
                    </form>
                )}
            </LayoutContent>
        </Layout>
    );
};

export default TriggerAddContainer;
