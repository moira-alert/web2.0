import React, { useState, useRef, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Fill, RowStack as LayoutRowStack } from "@skbkontur/react-stack-layout";
import { useTriggerFormContainer } from "../hooks/useTriggerFormContainer";
import MoiraApi from "../Api/MoiraApi";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import { DEFAULT_TRIGGER_TTL, Trigger } from "../Domain/Trigger";
import { getPageLink } from "../Domain/Global";
import { Status } from "../Domain/Status";
import { Config } from "../Domain/Config";
import { DaysOfWeek } from "../Domain/Schedule";
import { omitTrigger } from "../helpers/omitTypes";
import RouterLink from "../Components/RouterLink/RouterLink";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import TriggerEditForm from "../Components/TriggerEditForm/TriggerEditForm";
import { RowStack, ColumnStack, Fit } from "../Components/ItemsStack/ItemsStack";
import FileLoader from "../Components/FileLoader/FileLoader";

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
    is_remote: false,
    error_value: null,
    warn_value: null,
    trigger_type: "rising",
    mute_new_metrics: false,
    alone_metrics: {},
};

type Props = RouteComponentProps & { moiraApi: MoiraApi };

function TriggerAddContainer(props: Props) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const [trigger, setTrigger] = useState<Partial<Trigger>>(defaultTrigger);
    const [tags, setTags] = useState<string[] | undefined>(undefined);
    const [config, setConfig] = useState<Config | undefined>(undefined);

    const {
        validationResult,
        setValidationResult,
        validateTrigger,
        updateTrigger,
    } = useTriggerFormContainer();

    const validationContainer = useRef<ValidationContainer>(null);

    const handleSubmit = async () => {
        setIsLoading(true);

        const updatedTrigger = updateTrigger(trigger);

        const isTriggerValid = await validateTrigger(
            validationContainer,
            updatedTrigger,
            props.moiraApi
        );
        if (!isTriggerValid) {
            setIsLoading(false);
            return;
        }

        try {
            const { moiraApi, history } = props;
            const { id } = await moiraApi.addTrigger(updatedTrigger);
            history.push(getPageLink("trigger", id));
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (update: Partial<Trigger>) => {
        setTrigger({
            ...trigger,
            ...update,
        });
        setError(undefined);
        setValidationResult(undefined);
    };

    const handleFileImport = (fileData: string, fileName: string) => {
        try {
            const trigger = JSON.parse(fileData);

            if (typeof trigger !== "object" && trigger != null) {
                throw new Error("Must be an object");
            }
            handleChange(omitTrigger(trigger));
        } catch (error) {
            setError(`File ${fileName} cannot be converted to trigger. ${error.message}`);
        }
    };

    useEffect(() => {
        document.title = "Moira - Add trigger";
        const getData = async (props: Props) => {
            const { moiraApi } = props;
            const localDataString = localStorage.getItem("moiraSettings");
            const { tags: localTags } = localDataString
                ? JSON.parse(localDataString)
                : { tags: [] };

            try {
                const { list } = await moiraApi.getTagList();
                const config = await moiraApi.getConfig();
                setTrigger((prevTrigger) => ({
                    ...prevTrigger,
                    tags: localTags,
                }));
                setConfig(config);
                setTags(list);
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        getData(props);
    }, [props]);

    return (
        <Layout loading={isLoading} error={error}>
            <LayoutContent>
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
                                        <Button use="primary" onClick={() => handleSubmit()}>
                                            <span data-tid="Add Trigger">Add trigger</span>
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
}

export default withMoiraApi(TriggerAddContainer);
