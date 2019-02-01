// @flow
import * as React from "react";
import type { ContextRouter } from "react-router-dom";
import type { IMoiraApi } from "../Api/MoiraApi";
import type { Pattern } from "../Domain/Pattern";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import PatternList from "../Components/PatternList/PatternList";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {
    loading: boolean,
    error: ?string,
    list: ?Array<Pattern>,
};

class PatternListContainer extends React.Component<Props, State> {
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
        this.getData(nextProps);
    }

    render(): React.Node {
        const { loading, error, list } = this.state;
        return (
            <Layout loading={loading} error={error}>
                <LayoutContent>
                    <LayoutTitle>Patterns</LayoutTitle>
                    {list && (
                        <PatternList
                            items={list}
                            onRemove={pattern => {
                                this.removePattern(pattern);
                            }}
                        />
                    )}
                </LayoutContent>
            </Layout>
        );
    }

    async getData(props: Props) {
        const { moiraApi } = props;
        try {
            const patterns = await moiraApi.getPatternList();
            this.setState({ ...patterns });
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ loading: false });
        }
    }

    async removePattern(pattern: string) {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        await moiraApi.delPattern(pattern);
        this.getData(this.props);
    }
}

export default withMoiraApi(PatternListContainer);
