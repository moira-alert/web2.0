// @flow
import * as React from "react";
import type { ContextRouter } from "react-router-dom";
import { ValidationContainer } from "react-ui-validations";
import Button from "retail-ui/components/Button";
import type { IMoiraApi } from "../Api/MoiraApi";
import type { Trigger } from "../Domain/Trigger";
import { getPageLink } from "../Domain/Global";
import { Statuses } from "../Domain/Status";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import RouterLink from "../Components/RouterLink/RouterLink";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import TriggerEditForm from "../Components/TriggerEditForm/TriggerEditForm";
import { RowStack, ColumnStack, Fit } from "../Components/ItemsStack/ItemsStack";
import type { Config } from "../Domain/Config";

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {
    loading: boolean,
    error: ?string,
    trigger: ?$Shape<Trigger>,
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
            trigger: {
                name: "",
                desc: "",
                targets: [""],
                tags: [],
                patterns: [],
                expression: "",
                ttl: 600,
                ttl_state: Statuses.NODATA,
                sched: {
                    startOffset: 0,
                    endOffset: 1439,
                    tzOffset: new Date().getTimezoneOffset(),
                    days: [
                        { name: "Mon", enabled: true },
                        { name: "Tue", enabled: true },
                        { name: "Wed", enabled: true },
                        { name: "Thu", enabled: true },
                        { name: "Fri", enabled: true },
                        { name: "Sat", enabled: true },
                        { name: "Sun", enabled: true },
                    ],
                },
                is_remote: false,
                error_value: null,
                warn_value: null,
                trigger_type: "rising",
            },
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
                    <LayoutTitle>Add trigger</LayoutTitle>
                    {trigger && (
                        <form>
                            <ColumnStack block gap={4}>
                                <Fit>
                                    <ValidationContainer ref={this.validationContainer}>
                                        {config != null && (
                                            <TriggerEditForm
                                                data={trigger}
                                                remoteAllowed={config.remoteAllowed}
                                                tags={tags || []}
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
                                                Add trigger
                                            </Button>
                                        </Fit>
                                        <Fit>
                                            <RouterLink to="/">Cancel</RouterLink>
                                        </Fit>
                                    </RowStack>
                                </Fit>
                                <Fit style={{ height: 50 }} />
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
        // ToDo отказаться от вереницы if
        if (this.validationContainer.current !== null) {
            const isValid: boolean = await this.validationContainer.current.validate();
            if (isValid && trigger) {
                this.setState({ loading: true });
                try {
                    const { id } = await moiraApi.addTrigger(trigger);
                    history.push(getPageLink("trigger", id));
                } catch (error) {
                    this.setState({ error: error.message, loading: false });
                }
            }
        }
    }

    handleChange(update: $Shape<Trigger>) {
        this.setState((prevState: State) => ({ trigger: { ...prevState.trigger, ...update } }));
    }

    async getData(props: Props) {
        const { moiraApi } = props;
        const localDataString = localStorage.getItem("moiraSettings");
        const { tags: localTags } =
            typeof localDataString === "string" ? JSON.parse(localDataString) : { tags: [] };
        try {
            const { list } = await moiraApi.getTagList();
            const config = await moiraApi.getConfig();
            this.setState(prevState => ({
                config,
                tags: list,
                trigger: {
                    ...prevState.trigger,
                    tags: localTags,
                },
            }));
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ loading: false });
        }
    }
}

export default withMoiraApi(TriggerEditContainer);
