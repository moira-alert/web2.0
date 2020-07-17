// @flow
import * as React from "react";
import type { ContextRouter } from "react-router-dom";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Button } from "@skbkontur/react-ui/components/Button";
import TrashIcon from "@skbkontur/react-icons/Trash";
import type { IMoiraApi } from "../Api/MoiraApi";
import type { Trigger } from "../Domain/Trigger";
import { getPageLink } from "../Domain/Global";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import RouterLink from "../Components/RouterLink/RouterLink";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import TriggerEditForm from "../Components/TriggerEditForm/TriggerEditForm";
import { ColumnStack, RowStack, Fit } from "../Components/ItemsStack/ItemsStack";
import type { Config } from "../Domain/Config";

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {
    loading: boolean,
    error: ?string,
    trigger: ?Trigger,
    tags: ?Array<string>,
    config: ?Config,
};

class TriggerEditContainer extends React.Component<Props, State> {
    state: State;

    validationContainer: { current: null | ValidationContainer };

    constructor(props: Props) {
        super(props);
        this.state = {
            loading: true,
            error: null,
            config: null,
            trigger: null,
            tags: null,
        };
        this.validationContainer = React.createRef<ValidationContainer>();
    }

    componentDidMount() {
        document.title = "Moira - Edit trigger";
        this.getData(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps: Props) {
        this.setState({ loading: true });
        this.getData(nextProps);
    }

    render(): React.Node {
        const { moiraApi } = this.props;
        const { loading, error, trigger, tags, config } = this.state;
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
                                                remoteAllowed={config.remoteAllowed}
                                                onChange={update => this.handleChange(update)}
                                                validateTriggerTarget={moiraApi.checkTriggerTarget}
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

        const isValid = await this.validateForm();
        if (isValid && trigger) {
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
    };

    handleChange(update: $Shape<Trigger>) {
        this.setState((prevState: State) => ({ trigger: { ...prevState.trigger, ...update } }));
    }

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
            const trigger = await moiraApi.getTrigger(id);
            const { list } = await moiraApi.getTagList();
            const config = await moiraApi.getConfig();
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
