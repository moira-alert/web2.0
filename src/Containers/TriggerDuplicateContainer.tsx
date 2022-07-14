import React, { useState, useRef, useEffect } from "react";
import { RouteComponentProps } from "react-router";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Toast } from "@skbkontur/react-ui/components/Toast/Toast";
import MoiraApi from "../Api/MoiraApi";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import { Trigger, ValidateTriggerResult, ValidateTriggerTarget } from "../Domain/Trigger";
import { getPageLink } from "../Domain/Global";
import { Config } from "../Domain/Config";
import RouterLink from "../Components/RouterLink/RouterLink";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import TriggerEditForm from "../Components/TriggerEditForm/TriggerEditForm";
import { ColumnStack, RowStack, Fit } from "../Components/ItemsStack/ItemsStack";

// TODO check id wasn't undefined
type Props = RouteComponentProps<{ id?: string }> & { moiraApi: MoiraApi };

function TriggerDuplicateContainer(props: Props) {
    const [validationResult, setValidationResult] = useState<ValidateTriggerResult | undefined>(
        undefined
    );
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | undefined>(undefined);
    const [trigger, setTrigger] = useState<Partial<Trigger> | undefined>(undefined);
    const [tags, setTags] = useState<string[] | undefined>(undefined);
    const [config, setConfig] = useState<Config | undefined>(undefined);

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
        setIsLoading(true);

        const isValid = await validationContainer.current?.validate();
        if (!isValid || !trigger) {
            setIsLoading(false);
            return;
        }

        let finalTrigger;
        switch (trigger.trigger_type) {
            case "expression":
                finalTrigger = {
                    ...trigger,
                    error_value: null,
                    warn_value: null,
                };
                break;
            case "rising":
            case "falling":
                finalTrigger = {
                    ...trigger,
                    expression: "",
                };
                break;
            default:
                throw new Error(`Unknown trigger type: ${trigger.trigger_type}`);
        }

        const validationResult = await handleValidateTrigger(finalTrigger);
        if (!validationResult) {
            setIsLoading(false);
            return;
        }

        const areTargetsValid = checkTargets(validationResult);
        if (!areTargetsValid) {
            setIsLoading(false);
            return;
        }

        try {
            const { moiraApi, history } = props;
            const { id } = await moiraApi.addTrigger(finalTrigger);
            history.push(getPageLink("trigger", id));
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

    const handleValidateTrigger = async (trigger: Partial<Trigger>) => {
        const { moiraApi } = props;
        try {
            const validationResult = await moiraApi.validateTrigger(trigger);
            setValidationResult(validationResult);
            return validationResult;
        } catch (error) {
            Toast.push(error.toString());
            return null;
        }
    };

    const checkTargets = ({ targets }: ValidateTriggerResult) => {
        return targets.every(
            ({ syntax_ok, tree_of_problems }: ValidateTriggerTarget) =>
                syntax_ok && !tree_of_problems
        );
    };

    useEffect(() => {
        document.title = "Moira - Duplicate trigger";
        const getData = async (props: Props) => {
            const { moiraApi, match } = props;
            const { id } = match.params;
            if (typeof id !== "string") {
                setError("Wrong trigger id");
                setIsLoading(false);
                return;
            }
            try {
                const [sourceTrigger, { list }, config] = await Promise.all([
                    moiraApi.getTrigger(id),
                    moiraApi.getTagList(),
                    moiraApi.getConfig(),
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
        getData(props);
    }, [props]);

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
}

export default withMoiraApi(TriggerDuplicateContainer);
