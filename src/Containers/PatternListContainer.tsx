import * as React from "react";
import MoiraApi from "../Api/MoiraApi";
import { Pattern } from "../Domain/Pattern";
import { SortingColumn } from "../Components/PatternList/PatternList";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import PatternList from "../Components/PatternList/PatternList";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";

type Props = { moiraApi: MoiraApi };
type State = {
    loading: boolean;
    error?: string;
    list?: Array<Pattern>;
    sortingColumn: SortingColumn;
    sortingDown: boolean;
};

class PatternListContainer extends React.Component<Props, State> {
    public state: State = {
        sortingColumn: "trigger",
        sortingDown: false,
        loading: false,
    };

    public componentDidMount() {
        document.title = "Moira - Patterns";
        this.getData(this.props);
    }

    public UNSAFE_componentWillReceiveProps(nextProps: Props) {
        this.getData(nextProps);
    }

    public render(): React.ReactElement {
        const { loading, error, list, sortingColumn, sortingDown } = this.state;
        return (
            <Layout loading={loading} error={error}>
                <LayoutContent>
                    <LayoutTitle>Patterns</LayoutTitle>
                    {list && (
                        <PatternList
                            items={this.sortPatterns(list)}
                            onSort={(sorting) => {
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
                            onRemove={this.removePattern}
                        />
                    )}
                </LayoutContent>
            </Layout>
        );
    }

    private async getData(props: Props) {
        try {
            const { list } = await props.moiraApi.getPatternList();
            this.setState({ list });
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ loading: false });
        }
    }

    private removePattern = async (pattern: string) => {
        this.setState({ loading: true });
        await this.props.moiraApi.delPattern(pattern);
        this.getData(this.props);
    };

    private sortPatterns(patterns: Array<Pattern>): Array<Pattern> {
        const { sortingColumn, sortingDown } = this.state;
        const sorting = {
            trigger: (x: Pattern, y: Pattern) => {
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
            metric: (x: Pattern, y: Pattern) => {
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
