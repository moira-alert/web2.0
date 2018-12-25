// @flow
import * as React from "react";
import type { ContextRouter } from "react-router-dom";
import type { IMoiraApi } from "../Api/MoiraAPI";
import type { Trigger } from "../Domain/Trigger";
import { getPageLink } from "../Domain/Global";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import { ValidationContainer } from "react-ui-validations";
import Button from "retail-ui/components/Button";
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

class TriggerDuplicateContainer extends React.Component<Props, State> {
    props: Props;
    state: State = {
        loading: true,
        error: null,
        config: null,
        trigger: null,
        tags: null,
    };
    triggerForm: ?ValidationContainer;

    componentDidMount() {
        this.getData(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
        this.setState({ loading: true });
        this.getData(nextProps);
    }

    cleanTrigger(sourceTrigger: Trigger): Trigger {
        const trigger = Object.assign({}, sourceTrigger);
        delete trigger.id;
        delete trigger.last_check;
        delete trigger.throttling;
        return {
            ...trigger,
            name: `${trigger.name} (copy)`,
            sched: { ...trigger.sched, tzOffset: new Date().getTimezoneOffset() },
        };
    }

    async getData(props: Props): Promise<void> {
        const { moiraApi, match } = props;
        const { id } = match.params;
        if (typeof id !== "string") {
            this.setState({ error: "Wrong trigger id", loading: false });
            return;
        }
        try {
            const sourceTrigger = await moiraApi.getTrigger(id);
            const { list } = await moiraApi.getTagList();
            const config = await moiraApi.getConfig();
            const trigger = this.cleanTrigger(sourceTrigger);
            this.setState({ trigger: trigger, tags: list, config: config });
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ loading: false });
        }
    }

    async validateForm(): Promise<boolean> {
        if (this.triggerForm == null) {
            return true;
        }
        return await this.triggerForm.validate();
    }

    async handleSubmit(): Promise<void> {
        const { trigger } = this.state;
        const { history, moiraApi } = this.props;
        const isValid = await this.validateForm();
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

    handleChange(update: $Shape<Trigger>) {
        this.setState((prevState: State) => ({ trigger: { ...prevState.trigger, ...update } }));
    }

    render(): React.Node {
        const { loading, error, trigger, tags, config } = this.state;
        return (
            <Layout loading={loading} error={error}>
                <LayoutContent>
                    <LayoutTitle>Duplicate trigger</LayoutTitle>
                    {trigger && (
                        <form>
                            <ColumnStack block gap={6} horizontalAlign="stretch">
                                <Fit>
                                    <ValidationContainer ref={x => (this.triggerForm = x)}>
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
                                                }}>
                                                Duplicate trigger
                                            </Button>
                                        </Fit>
                                        <Fit>
                                            <RouterLink to={`/trigger/${this.props.match.params.id}`}>
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
}

export default withMoiraApi(TriggerDuplicateContainer);
