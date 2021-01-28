import * as React from "react";
import { IMoiraApi } from "../Api/MoiraApi";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";

type Props = { moiraApi: IMoiraApi };
type State = {
    loading: boolean;
    error?: string;
};

class TeamsContainer extends React.Component<Props, State> {
    public state: State = {
        loading: false,
    };

    public componentDidMount() {
        document.title = "Moira - Teams";
        this.getData(this.props);
    }

    public UNSAFE_componentWillReceiveProps(nextProps: Props) {
        this.getData(nextProps);
    }

    public render(): React.ReactElement {
        const { loading, error } = this.state;
        return (
            <Layout loading={loading} error={error}>
                <LayoutContent>
                    <LayoutTitle>Teams</LayoutTitle>
                </LayoutContent>
            </Layout>
        );
    }

    private async getData(_props: Props) {
        try {
            // const { list } = await props.moiraApi.getPatternList();
            // this.setState({ list });
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ loading: false });
        }
    }
}

export default withMoiraApi(TeamsContainer);
