// @flow
import * as React from "react";
import type { ContextRouter } from "react-router-dom";
import type { IMoiraApi } from "../Api/MoiraApi";
import type { Pattern } from "../Domain/Pattern";
import type { SortingColumn } from "../Components/PatternList/PatternList";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import PatternList from "../Components/PatternList/PatternList";
import Layout, { LayoutContent, LayoutTitle } from "../Components/Layout/Layout";

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {
    loading: boolean,
    error: ?string,
    list: ?Array<Pattern>,
    sortingColumn: SortingColumn,
    sortingDown: boolean,
};

class PatternListContainer extends React.Component<Props, State> {
    state: State;

    constructor(props: Props) {
        super(props);
        this.state = {
            sortingColumn: "trigger",
            sortingDown: false,
            loading: false,
            error: null,
            list: null,
        };
    }

    componentDidMount() {
        document.title = "Moira - Patterns";
        this.getData(this.props);
    }

    UNSAFE_componentWillReceiveProps(nextProps: Props) {
        this.getData(nextProps);
    }

    render(): React.Node {
        const { loading, error, list, sortingColumn, sortingDown } = this.state;
        return (
            <Layout loading={loading} error={error}>
                <LayoutContent>
                    <LayoutTitle>Patterns</LayoutTitle>
                    {list && (
                        <PatternList
                            items={this.sortPatterns(list)}
                            onSort={sorting => {
                                if (sorting === sortingColumn) {
                                    this.setState({ sortingDown: !sortingDown });
                                } else {
                                    this.setState({
                                        sortingColumn: sorting,
                                        sortingDown: true,
                                    });
                                }
                            }}
                            sortingColumn={sortingColumn}
                            sortingDown={sortingDown}
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

    sortPatterns(patterns: Array<Pattern>): Array<Pattern> {
        const { sortingColumn, sortingDown } = this.state;
        const sorting = {
            trigger: (x, y) => {
                const valA = x.triggers.length || 0;
                const valB = y.triggers.length || 0;
                if (valA < valB) {
                    return sortingDown ? -1 : 1;
                }
                if (valA > valB) {
                    return sortingDown ? 1 : -1;
                }
                return 0;
            },
            metric: (x, y) => {
                const valA = x.metrics.length || 0;
                const valB = y.metrics.length || 0;
                if (valA < valB) {
                    return sortingDown ? -1 : 1;
                }
                if (valA > valB) {
                    return sortingDown ? 1 : -1;
                }
                return 0;
            },
        };
        return patterns.slice(0).sort(sorting[sortingColumn]);
    }
}

export default withMoiraApi(PatternListContainer);
