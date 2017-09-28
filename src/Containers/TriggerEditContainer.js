// @flow
import React from 'react';
import type { ContextRouter } from 'react-router-dom';
import type { IMoiraApi } from '../Api/MoiraAPI';
import type { Trigger } from '../Domain/Trigger';
import { getPageLink } from '../Domain/Global';
import { withMoiraApi } from '../Api/MoiraApiInjection';
import { ValidationContainer } from 'react-ui-validations';
import Button from 'retail-ui/components/Button';
import Layout, { LayoutContent, LayoutTitle } from '../Components/Layout/Layout';
import TriggerEditForm from '../Components/TriggerEditForm/TriggerEditForm';

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {|
    loading: boolean;
    error: ?string;
    trigger: ?Trigger;
    tags: ?Array<string>;
|};

class TriggerEditContainer extends React.Component {
    props: Props;
    state: State = {
        loading: true,
        error: null,
        trigger: null,
        tags: null,
    };

    componentDidMount() {
        this.getData(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
        this.setState({ loading: true });
        this.getData(nextProps);
    }

    async getData(props: Props): Promise<void> {
        const { moiraApi, match } = props;
        const { id } = match.params;
        if (typeof id !== 'string') {
            this.setState({ error: 'Wrong trigger id' });
            return;
        }
        try {
            const trigger = await moiraApi.getTrigger(id);
            const { list } = await moiraApi.getTagList();
            this.setState({ loading: false, trigger: trigger, tags: list });
        }
        catch (error) {
            this.setState({ error: error.message });
        }
    }

    async handleSubmit(): Promise<void> {
        const { trigger } = this.state;
        const { history, moiraApi } = this.props;
        const isValid: boolean = await this.refs.triggerForm.validate();
        if (isValid && trigger) {
            this.setState({ loading: true });
            try {
                await moiraApi.setTrigger(trigger.id, trigger);
                history.push(getPageLink('trigger', trigger.id));
            }
            catch (error) {
                this.setState({ error: error.message, loading: false });
            }
        }
    }

    async deleteTrigger(id: string): Promise<void> {
        const { history, moiraApi } = this.props;
        this.setState({ loading: true });
        try {
            await moiraApi.delTrigger(id);
            history.push(getPageLink('index'));
        }
        catch (error) {
            this.setState({ error: error.message, loading: false });
        }
    }

    handleChange(update: $Shape<Trigger>) {
        this.setState((prevState: State) => ({ trigger: { ...prevState.trigger, ...update } }));
    }

    render(): React.Element<*> {
        const { loading, error, trigger, tags } = this.state;
        return (
            <Layout loading={loading} error={error}>
                <LayoutContent>
                    <LayoutTitle>Edit trigger</LayoutTitle>
                    {trigger && (
                        <form>
                            <ValidationContainer ref='triggerForm'>
                                <TriggerEditForm
                                    data={trigger}
                                    tags={tags || []}
                                    onChange={update => this.handleChange(update)}
                                />
                            </ValidationContainer>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    margin: '40px 0 30px 150px',
                                }}>
                                <div style={{ marginRight: '15px' }}>
                                    <Button
                                        use='primary'
                                        onClick={() => {
                                            this.handleSubmit();
                                        }}>
                                        Save trigger
                                    </Button>
                                </div>
                                <div>
                                    <Button
                                        use='link'
                                        icon='Trash'
                                        onClick={() => {
                                            this.deleteTrigger(trigger.id);
                                        }}>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}
                </LayoutContent>
            </Layout>
        );
    }
}

export default withMoiraApi(TriggerEditContainer);
