// @flow
import React from 'react';
import type { ContextRouter } from 'react-router-dom';
import type { IMoiraApi } from '../Api/MoiraAPI';
import type { Trigger } from '../Domain/Trigger';
import { getPageLink } from '../Domain/Global';
import { Statuses } from '../Domain/Status';
import { withMoiraApi } from '../Api/MoiraApiInjection';
import { ValidationContainer } from 'react-ui-validations';
import Button from 'retail-ui/components/Button';
import Layout, { LayoutContent, LayoutTitle } from '../Components/Layout/Layout';
import TriggerEditForm from '../Components/TriggerEditForm/TriggerEditForm';

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {|
    loading: boolean;
    error: ?string;
    trigger: ?$Shape<Trigger>;
    tags: ?Array<string>;
|};

class TriggerEditContainer extends React.Component {
    props: Props;
    state: State = {
        loading: true,
        error: null,
        trigger: {
            name: '',
            desc: '',
            targets: [''],
            tags: [],
            patterns: [],
            expression: '',
            ttl: 600,
            ttl_state: Statuses.NODATA,
            sched: {
                startOffset: 0,
                endOffset: 1439,
                tzOffset: -300,
                days: [
                    { name: 'Mon', enabled: true },
                    { name: 'Tue', enabled: true },
                    { name: 'Wed', enabled: true },
                    { name: 'Thu', enabled: true },
                    { name: 'Fri', enabled: true },
                    { name: 'Sat', enabled: true },
                    { name: 'Sun', enabled: true },
                ],
            },
        },
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
        const { moiraApi } = props;
        try {
            const { list } = await moiraApi.getTagList();
            this.setState({ loading: false, tags: list });
        }
        catch (error) {
            this.setState({ error: error.message });
        }
    }

    async handleSubmit(): Promise<void> {
        const { trigger } = this.state;
        const { history, moiraApi } = this.props;
        const isValid: boolean = await this.refs.triggerForm.validate();
        if (isValid) {
            this.setState({ loading: true });
            try {
                const { id } = await moiraApi.addTrigger(trigger);
                history.push(getPageLink('trigger', id));
            }
            catch (error) {
                this.setState({ error: error.message, loading: false });
            }
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
                    <LayoutTitle>Add trigger</LayoutTitle>
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
                                    margin: '40px 0 30px 150px',
                                }}>
                                <Button
                                    use='primary'
                                    onClick={() => {
                                        this.handleSubmit();
                                    }}>
                                    Add trigger
                                </Button>
                            </div>
                        </form>
                    )}
                </LayoutContent>
            </Layout>
        );
    }
}

export default withMoiraApi(TriggerEditContainer);
