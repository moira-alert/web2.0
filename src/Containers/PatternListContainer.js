// @flow
import React from 'react';
import type { ContextRouter } from 'react-router-dom';
import type { IMoiraApi } from '../Api/MoiraAPI';
import type { Pattern } from '../Domain/Pattern';
import { withMoiraApi } from '../Api/MoiraApiInjection';
import Layout from '../Components/Layout/Layout';

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {|
    loading: boolean,
    error: ?string,
    list: ?Array<Pattern>,
|};

class PatternListContainer extends React.Component {
    props: Props;
    state: State = {
        loading: true,
        error: null,
        list: null,
    };

    componentDidMount() {
        this.getData();
    }

    async getData(): Promise<void> {
        const { moiraApi } = this.props;
        try {
            const patterns = await moiraApi.getPatternList();
            this.setState({ loading: false, ...patterns });
        } catch (error) {
            this.setState({ error: 'Network error. Please, reload page' });
        }
    }

    render(): React.Element<*> {
        const { loading, error, list } = this.state;
        return (
            <Layout loading={loading} error={error}>
                <Layout.Content>
                    <pre>{JSON.stringify(list, null, 2)}</pre>
                </Layout.Content>
            </Layout>
        );
    }
}

export default withMoiraApi(PatternListContainer);
