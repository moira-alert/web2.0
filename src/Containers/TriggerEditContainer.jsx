// @flow
import * as React from "react";
import type { ContextRouter } from "react-router-dom";
import { ValidationContainer } from "react-ui-validations";
import Button from "retail-ui/components/Button";
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
        this.getData(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
        this.setState({ loading: true });
        this.getData(nextProps);
    }

    render(): React.Node {
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
                                                Save trigger
                                            </Button>
                                        </Fit>
                                        <Fit>
                                            <Button
                                                use="link"
                                                icon={<TrashIcon />}
                                                onClick={() => {
                                                    this.deleteTrigger(trigger.id);
                                                }}
                                            >
                                                Delete
                                            </Button>
                                        </Fit>
                                        <Fit>
                                            <RouterLink to={`/trigger/${trigger.id}`}>
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
        const { trigger } = this.state;
        const { history, moiraApi } = this.props;

        const isValid = await this.validateForm();
        if (isValid && trigger) {
            this.setState({ loading: true });
            try {
                await moiraApi.setTrigger(trigger.id, trigger);
                history.push(getPageLink("trigger", trigger.id));
            } catch (error) {
                this.setState({ error: error.message, loading: false });
            }
        }
    }

    handleChange(update: $Shape<Trigger>) {
        this.setState((prevState: State) => ({ trigger: { ...prevState.trigger, ...update } }));
    }

    async deleteTrigger(id: string) {
        const { history, moiraApi } = this.props;
        this.setState({ loading: true });
        try {
            await moiraApi.delTrigger(id);
            history.push(getPageLink("index"));
        } catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    }

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
