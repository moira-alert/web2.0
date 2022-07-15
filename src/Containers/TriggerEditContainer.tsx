import React, { useState, useRef, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Button } from "@skbkontur/react-ui/components/Button";
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
import { ColumnStack, RowStack, Fit } from "../Components/ItemsStack/ItemsStack";

type Props = RouteComponentProps<{ id?: string }> & { moiraApi: MoiraApi };

function TriggerEditContainer(props: Props) {
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const [trigger, setTrigger] = useState<Trigger | undefined>(undefined);
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
        if (!trigger) {
            return;
        }

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
            await moiraApi.setTrigger(trigger.id, updatedTrigger);
            history.push(getPageLink("trigger", updatedTrigger.id));
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (update: Partial<Trigger>) => {
        if (!trigger) {
            return;
        }
        setTrigger({ ...trigger, ...update });
        setError(undefined);
        setValidationResult(undefined);
    };

    const deleteTrigger = async (id: string) => {
        const { moiraApi, history } = props;
        setIsLoading(true);
        try {
            await moiraApi.delTrigger(id);
            history.push(getPageLink("index"));
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        document.title = "Moira - Edit trigger";
        const getData = async (props: Props) => {
            const { moiraApi, match } = props;
            const { id } = match.params;
            if (typeof id !== "string") {
                setError("Wrong trigger id");
                setIsLoading(false);
                return;
            }
            try {
                const [trigger, { list }, config] = await Promise.all([
                    moiraApi.getTrigger(id),
                    moiraApi.getTagList(),
                    moiraApi.getConfig(),
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
        getData(props);
    }, [props]);

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
                                        <Button use="primary" onClick={handleSubmit}>
                                            Save trigger
                                        </Button>
                                    </Fit>
                                    <Fit>
                                        <Button
                                            use="link"
                                            icon={<TrashIcon />}
                                            onClick={() => deleteTrigger(trigger.id)}
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
}

export default withMoiraApi(TriggerEditContainer);
