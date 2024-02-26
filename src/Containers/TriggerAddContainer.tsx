import React, { useState, useRef, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Fill, RowStack as LayoutRowStack } from "@skbkontur/react-stack-layout";
import { useSaveTrigger } from "../hooks/useSaveTrigger";
import MoiraApi from "../Api/MoiraApi";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import { DEFAULT_TRIGGER_TTL, Trigger, TriggerSource } from "../Domain/Trigger";
import { getPageLink } from "../Domain/Global";
import { Status } from "../Domain/Status";
import { Config } from "../Domain/Config";
import { DaysOfWeek } from "../Domain/Schedule";
import { omitTrigger } from "../helpers/omitTypes";
import RouterLink from "../Components/RouterLink/RouterLink";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import TriggerEditForm from "../Components/TriggerEditForm/TriggerEditForm";
import { RowStack, ColumnStack, Fit } from "../Components/ItemsStack/ItemsStack";
import FileLoader from "../Components/FileLoader/FileLoader";
import { useValidateTrigger } from "../hooks/useValidateTrigger";
import {
    setError,
    setIsLoading,
    setIsSaveButtonDisabled,
    setIsSaveModalVisible,
    useTriggerFormContainerReducer,
} from "../hooks/useTriggerFormContainerReducer";
import { TriggerSaveWarningModal } from "../Components/TriggerSaveWarningModal/TriggerSaveWarningModal";
import { setDocumentTitle } from "../helpers/setDocumentTitle";

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

type Props = RouteComponentProps & { moiraApi: MoiraApi };

const TriggerAddContainer = (props: Props) => {
    const [state, dispatch] = useTriggerFormContainerReducer();
    const [trigger, setTrigger] = useState<Partial<Trigger>>(defaultTrigger);
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
        trigger?.trigger_source == TriggerSource.GRAPHITE_LOCAL
            ? validateTrigger(trigger)
            : saveTrigger(trigger);

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

    const getData = async () => {
        const localDataString = localStorage.getItem("moiraSettings");
        const { tags: localTags } = localDataString ? JSON.parse(localDataString) : { tags: [] };

        try {
            const { list } = await props.moiraApi.getTagList();
            const config = await props.moiraApi.getConfig();
            setTrigger((prev) => {
                return { ...prev, tags: localTags };
            });
            setConfig(config);
            setTags(list);
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(setIsLoading(false));
        }
    };

    useEffect(() => {
        setDocumentTitle("Add trigger");
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

export default withMoiraApi(TriggerAddContainer);
