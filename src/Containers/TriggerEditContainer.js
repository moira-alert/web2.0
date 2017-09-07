// @flow
import React from 'react';
import type { ContextRouter } from 'react-router-dom';
import type { IMoiraApi } from '../Api/MoiraAPI';
import type { Trigger } from '../Domain/Trigger';
import { withMoiraApi } from '../Api/MoiraApiInjection';
import Layout from '../Components/Layout/Layout';
import TriggerEditForm from '../Components/TriggerEditForm/TriggerEditForm';

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {|
    loading: boolean;
    error: ?string;
    trigger: ?Trigger;
|};

class TriggerEditContainer extends React.Component {
    props: Props;
    state: State = {
        loading: true,
        error: null,
        trigger: null,
    };

    componentDidMount() {
        this.getData();
    }

    async getData(): Promise<void> {
        const { moiraApi, match } = this.props;
        const { id } = match.params;
        if (typeof id !== 'string') {
            return;
        }
        try {
            const trigger = await moiraApi.getTrigger(id);
            this.setState({ loading: false, trigger });
        }
        catch (error) {
            this.setState({ error: 'Network error. Please, reload page' });
        }
    }

    render(): React.Element<*> {
        const { loading, error, trigger } = this.state;
        return (
            <Layout loading={loading} error={error}>
                <Layout.Content>{trigger && <TriggerEditForm data={trigger} />}</Layout.Content>
            </Layout>
        );
    }
}

export default withMoiraApi(TriggerEditContainer);
