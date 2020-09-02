import React, { RefObject } from "react";
import { RouteComponentProps } from "react-router";
import { ValidationContainer } from "@skbkontur/react-ui-validations";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Fill, RowStack as LayoutRowStack } from "@skbkontur/react-stack-layout";
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
import FileLoader from "../Components/FileLoader/FileLoader";
import { omitTrigger } from "../helpers/omitTypes";
import { DaysOfWeek } from "../Domain/Schedule";

type Props = RouteComponentProps & { moiraApi: IMoiraApi };
type State = {
    loading: boolean;
    error?: string;
    trigger?: Partial<Trigger>;
    tags?: string[];
    config?: Config;
};

class TriggerAddContainer extends React.Component<Props, State> {
    public state: State = {
        loading: true,
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
        },
    };

    private validationContainer: RefObject<ValidationContainer> = React.createRef<
        ValidationContainer
    >();

    componentDidMount() {
        document.title = "Moira - Add trigger";
        this.getData(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps: Props) {
        this.setState({ loading: true });
        this.getData(nextProps);
    }

    render(): React.ReactElement {
        const { moiraApi } = this.props;
        const { loading, error, trigger, tags, config } = this.state;

        return (
            <Layout loading={loading} error={error}>
                <LayoutContent>
                    <LayoutRowStack baseline block gap={6} style={{ maxWidth: "800px" }}>
                        <Fill>
                            <LayoutTitle>Add trigger</LayoutTitle>
                        </Fill>
                        <FileLoader onLoad={this.handleFileImport}>Import</FileLoader>
                    </LayoutRowStack>
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
                                                onChange={this.handleChange}
                                                validateTrigger={moiraApi.validateTrigger}
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
                                                <span data-tid="Add Trigger">Add trigger</span>
                                            </Button>
                                        </Fit>
                                        <Fit>
                                            <RouterLink to={getPageLink("index")}>
                                                Cancel
                                            </RouterLink>
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

    async handleSubmit() {
        let { trigger } = this.state;
        const { moiraApi, history } = this.props;
        const isValid: boolean | undefined = await this.validationContainer.current?.validate();
        // ToDo отказаться от вереницы if
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
                const { id } = await moiraApi.addTrigger(trigger);
                history.push(getPageLink("trigger", id));
            } catch (error) {
                this.setState({ error: error.message, loading: false });
            }
        }
    }

    handleChange = (update: Partial<Trigger>, callback?: () => void) => {
        this.setState(
            (prevState: State) => ({
                trigger: { ...prevState.trigger, ...update },
                error: undefined,
            }),
            callback
        );
    };

    handleFileImport = (fileData: string, fileName: string) => {
        try {
            const trigger = JSON.parse(fileData);

            if (typeof trigger !== "object" && trigger != null) {
                throw new Error("Must be a object");
            }
            this.handleChange(omitTrigger(trigger));
        } catch (e) {
            this.setState({
                error: `File ${fileName} cannot be converted to trigger. ${e.message}`,
            });
        }
    };

    async getData(props: Props) {
        const { moiraApi } = props;
        const localDataString = localStorage.getItem("moiraSettings");
        const { tags: localTags } =
            typeof localDataString === "string" ? JSON.parse(localDataString) : { tags: [] };
        try {
            const { list } = await moiraApi.getTagList();
            const config = await moiraApi.getConfig();
            this.setState((prevState) => ({
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

export default withMoiraApi(TriggerAddContainer);
