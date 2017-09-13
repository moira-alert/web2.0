// @flow
import React from 'react';
import type { ContextRouter } from 'react-router-dom';
import type { IMoiraApi } from '../Api/MoiraAPI';
import type { Pattern } from '../Domain/Pattern';
import { withMoiraApi } from '../Api/MoiraApiInjection';
import PatternList from '../Components/PatternList/PatternList';
import Layout from '../Components/Layout/Layout';

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {|
    loading: boolean;
    error: ?string;
    list: ?Array<Pattern>;
|};

class PatternListContainer extends React.Component {
    props: Props;
    state: State = {
        loading: true,
        error: null,
        list: null,
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
            const patterns = await moiraApi.getPatternList();
            this.setState({ loading: false, ...patterns });
        }
        catch (error) {
            this.setState({ error: 'Network error. Please, reload page' });
        }
    }

    async removePattern(pattern: string): Promise<void> {
        this.setState({ loading: true });
        await this.props.moiraApi.delPattern(encodeURI(pattern));
        this.getData(this.props);
    }

    render(): React.Element<*> {
        const { loading, error, list } = this.state;
        return (
            <Layout loading={loading} error={error}>
                <Layout.Content>
                    {list && (
                        <PatternList
                            items={list}
                            onRemove={pattern => {
                                this.removePattern(pattern);
                            }}
                        />
                    )}
                </Layout.Content>
            </Layout>
        );
    }
}

export default withMoiraApi(PatternListContainer);
