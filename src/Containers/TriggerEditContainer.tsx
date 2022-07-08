import * as React from "react";
import { RouteComponentProps } from "react-router";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Button } from "@skbkontur/react-ui/components/Button";
import TrashIcon from "@skbkontur/react-icons/Trash";
import MoiraApi from "../Api/MoiraApi";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import type { Trigger, ValidateTriggerResult, ValidateTriggerTarget } from "../Domain/Trigger";
import { getPageLink } from "../Domain/Global";
import { Config } from "../Domain/Config";
import RouterLink from "../Components/RouterLink/RouterLink";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import TriggerEditForm from "../Components/TriggerEditForm/TriggerEditForm";
import { ColumnStack, RowStack, Fit } from "../Components/ItemsStack/ItemsStack";
import { Toast } from "@skbkontur/react-ui/components/Toast/Toast";
import has from "lodash/has";

type Props = RouteComponentProps<{ id?: string }> & { moiraApi: MoiraApi };
type State = {
    loading: boolean;
    error?: string;
    trigger?: Trigger;
    tags?: Array<string>;
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

class TriggerEditContainer extends React.Component<Props, State> {
    public state: State = { loading: true };
    private validationContainer = React.createRef<ValidationContainer>();
    private asyncValidator = getAsyncValidator();

    componentDidMount() {
        document.title = "Moira - Edit trigger";
        this.getData(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps: Props) {
        this.setState({ loading: true });
        this.getData(nextProps);
    }

    render(): React.ReactElement {
        const { loading, error, trigger, tags, config, validationResult } = this.state;
        return (
            <Layout loading={loading} error={error}>
                <LayoutContent>
                    <LayoutTitle>Edit trigger</LayoutTitle>
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
                                            <Button use="primary" onClick={this.handleSubmit}>
                                                Save trigger
                                            </Button>
                                        </Fit>
                                        <Fit>
                                            <Button
                                                use="link"
                                                icon={<TrashIcon />}
                                                onClick={() => this.deleteTrigger(trigger.id)}
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

    handleSubmit = async () => {
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
                    await moiraApi.setTrigger(trigger.id, trigger);
                    history.push(getPageLink("trigger", trigger.id));
                } catch (error) {
                    this.setState({ error: error.message, loading: false });
                }
            }
        }
    };

    handleChange = (update: Partial<Trigger>, callback?: () => void) => {
        this.setState(
            (prevState: State) => ({
                trigger: prevState.trigger ? { ...prevState.trigger, ...update } : undefined,
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

    deleteTrigger = async (id: string) => {
        const { moiraApi, history } = this.props;
        this.setState({ loading: true });
        try {
            await moiraApi.delTrigger(id);
            history.push(getPageLink("index"));
        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    };

    async getData(props: Props) {
        const { moiraApi, match } = props;
        const { id } = match.params;
        if (typeof id !== "string") {
            this.setState({ error: "Wrong trigger id", loading: false });
            return;
        }
        try {
            const [trigger, { list }, config] = await Promise.all([
                moiraApi.getTrigger(id),
                moiraApi.getTagList(),
                moiraApi.getConfig(),
            ]);

            this.setState({
                trigger,
                tags: list,
                config,
            });
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

export default withMoiraApi(TriggerEditContainer);
