import React, { useState, useRef, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Button } from "@skbkontur/react-ui/components/Button";
import { useTriggerFormContainer } from "../hooks/useTriggerFormContainer";
import MoiraApi from "../Api/MoiraApi";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import { Trigger } from "../Domain/Trigger";
import { getPageLink } from "../Domain/Global";
import { Config } from "../Domain/Config";
import RouterLink from "../Components/RouterLink/RouterLink";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import TriggerEditForm from "../Components/TriggerEditForm/TriggerEditForm";
import { ColumnStack, RowStack, Fit } from "../Components/ItemsStack/ItemsStack";

// TODO check id wasn't undefined
type Props = RouteComponentProps<{ id?: string }> & { moiraApi: MoiraApi };

const TriggerDuplicateContainer = (props: Props) => {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const [trigger, setTrigger] = useState<Partial<Trigger> | undefined>(undefined);
    const [tags, setTags] = useState<string[] | undefined>(undefined);
    const [config, setConfig] = useState<Config | undefined>(undefined);

    const {
        validationResult,
        setValidationResult,
        validateTrigger,
        updateTrigger,
    } = useTriggerFormContainer(props.moiraApi);

    const validationContainer = useRef<ValidationContainer>(null);

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
            const { id } = await props.moiraApi.addTrigger(updatedTrigger);
            props.history.push(getPageLink("trigger", id));
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

    const getData = async () => {
        const { id } = props.match.params;
        if (typeof id !== "string") {
            setError("Wrong trigger id");
            setIsLoading(false);
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
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Moira - Duplicate trigger";
        getData();
    }, []);

    return (
        <Layout loading={isLoading} error={error}>
            <LayoutContent>
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
                                            onClick={() => {
                                                handleSubmit();
                                            }}
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
