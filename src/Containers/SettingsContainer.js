// @flow
import React from 'react';
import type { ContextRouter } from 'react-router-dom';
import type { IMoiraApi } from '../Api/MoiraAPI';
import type { Settings } from '../Domain/Settings';
import { withMoiraApi } from '../Api/MoiraApiInjection';
import Layout, { LayoutContent, LayoutTitle } from '../Components/Layout/Layout';

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {|
    loading: boolean;
    error: ?string;
    settings: ?Settings;
|};

class SettingsContainer extends React.Component {
    props: Props;
    state: State = {
        loading: true,
        error: null,
        settings: null,
    };

    componentDidMount() {
        this.getData();
    }

    async getData(): Promise<void> {
        const { moiraApi } = this.props;
        try {
            const settings = await moiraApi.getSettings();
            this.setState({ loading: false, settings });
        }
        catch (error) {
            this.setState({ error: 'Network error. Please, reload page' });
        }
    }

    render(): React.Element<*> {
        const { loading, error, settings } = this.state;
        return (
            <Layout loading={loading} error={error}>
                <LayoutContent>
                    <LayoutTitle>Settings</LayoutTitle>
                    <pre>{JSON.stringify(settings, null, 2)}</pre>
                </LayoutContent>
            </Layout>
        );
    }
}

export default withMoiraApi(SettingsContainer);
