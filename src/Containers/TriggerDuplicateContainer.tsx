import React from "react";
import { RouteComponentProps } from "react-router";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Button } from "@skbkontur/react-ui/components/Button";
import MoiraApi from "../Api/MoiraApi";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import { Trigger, ValidateTriggerResult, ValidateTriggerTarget } from "../Domain/Trigger";
import { getPageLink } from "../Domain/Global";
import { Config } from "../Domain/Config";
import RouterLink from "../Components/RouterLink/RouterLink";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import TriggerEditForm from "../Components/TriggerEditForm/TriggerEditForm";
import { ColumnStack, RowStack, Fit } from "../Components/ItemsStack/ItemsStack";
import { Toast } from "@skbkontur/react-ui/components/Toast/Toast";
import has from "lodash/has";

// TODO check id wasn't undefined
type Props = RouteComponentProps<{ id?: string }> & { moiraApi: MoiraApi };
type State = {
    loading: boolean;
    error?: string;
    trigger?: Partial<Trigger>;
    tags?: string[];
    config?: Config;
    validationResult?: ValidateTriggerResult;
};

function getAsyncValidator() {
    let storage;
    return async (
        condition: Promise<ValidateTriggerResult>,
        callback: (value: ValidateTriggerResult) => void
    ) => {
        storage = condition;
        try {
            const result = await condition;

            if (storage === condition) {
                callback(result);
            }
        } catch (e) {
            Toast.push(e.toString());
        }
    };
}

class TriggerDuplicateContainer extends React.Component<Props, State> {
    public state: State = {
        loading: true,
    };

    private validationContainer = React.createRef<ValidationContainer>();
    private asyncValidator = getAsyncValidator();

    public componentDidMount() {
        document.title = "Moira - Duplicate trigger";
        this.getData(this.props);
    }

    public UNSAFE_componentWillReceiveProps(nextProps: Props) {
        this.setState({ loading: true });
        this.getData(nextProps);
    }

    static cleanTrigger(sourceTrigger: Trigger): Partial<Trigger> {
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
    }

    render(): React.ReactElement {
        const { match } = this.props;
        const { loading, error, trigger, tags, config, validationResult } = this.state;
        return (
            <Layout loading={loading} error={error}>
                <LayoutContent>
                    <LayoutTitle>Duplicate trigger</LayoutTitle>
                    {trigger && (
                        <form>
                            <ColumnStack block gap={6} horizontalAlign="stretch">
                                <Fit>
                                    <ValidationContainer ref={this.validationContainer}>
                                        {config != null && (
                                            <TriggerEditForm
                                                data={trigger}
                                                tags={tags || []}
                                                remoteAllowed={true}
                                                onChange={this.handleChange}
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
                                                    this.handleSubmit();
                                                }}
                                            >
                                                Duplicate trigger
                                            </Button>
                                        </Fit>
                                        <Fit>
                                            <RouterLink
                                                to={getPageLink(
                                                    "trigger",
                                                    match && match.params && match.params.id
                                                        ? match.params.id
                                                        : ""
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

    async handleSubmit() {
        let { trigger } = this.state;
        const { moiraApi, history } = this.props;
        const isValid = (await this.validateForm()) && !has(this.state.validationResult, "targets");
        if (isValid && trigger) {
            await this.handleValidateTrigger(trigger);
            const areTargetsValid = this.checkTargets();
            if (areTargetsValid) {
                this.setState({ loading: true });
                if (trigger.trigger_type === "expression") {
                    trigger = {
                        ...trigger,
                        error_value: null,
                        warn_value: null,
                    };
                }
                if (trigger.trigger_type === "rising" || trigger.trigger_type === "falling") {
                    trigger = {
                        ...trigger,
                        expression: "",
                    };
                }
                try {
                    const { id } = await moiraApi.addTrigger(trigger);
                    history.push(getPageLink("trigger", id));
                } catch (error) {
                    this.setState({ error: error.message, loading: false });
                }
            }
        }
    }

    handleChange = (update: Partial<Trigger>, callback?: () => void) => {
        this.setState(
            (prevState: State) => ({
                trigger: { ...prevState.trigger, ...update },
                validationResult: undefined,
            }),
            callback
        );
    };

    private handleValidateTrigger = async (trigger: Partial<Trigger>) => {
        const { moiraApi } = this.props;

        await this.asyncValidator(
            moiraApi.validateTrigger(trigger),
            (validationResult: ValidateTriggerResult) => {
                this.setState({ validationResult });
            }
        );
    };

    private checkTargets = () =>
        this.state.validationResult?.targets.every(
            ({ syntax_ok, tree_of_problems }: ValidateTriggerTarget) =>
                syntax_ok && !tree_of_problems
        );

    async getData(props: Props) {
        const { moiraApi, match } = props;
        const { id } = match.params;
        if (typeof id !== "string") {
            this.setState({ error: "Wrong trigger id", loading: false });
            return;
        }
        try {
            const [sourceTrigger, { list }, config] = await Promise.all([
                moiraApi.getTrigger(id),
                moiraApi.getTagList(),
                moiraApi.getConfig(),
            ]);

            const trigger = TriggerDuplicateContainer.cleanTrigger(sourceTrigger);
            this.setState({ trigger, tags: list, config });
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ loading: false });
        }
    }

    async validateForm(): Promise<boolean> {
        if (this.validationContainer.current == null) {
            return true;
        }
        return this.validationContainer.current.validate();
    }
}

export default withMoiraApi(TriggerDuplicateContainer);
