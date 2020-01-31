// @flow
import * as React from "react";
import queryString from "query-string";
import intersection from "lodash/intersection";
import type { ContextRouter } from "react-router-dom";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import type { IMoiraApi } from "../Api/MoiraApi";
import type { TriggerList, Trigger } from "../Domain/Trigger";
import MobileTriggerListPage from "../Components/Mobile/MobileTriggerListPage/MobileTriggerListPage";
import MobileTagSelectorPage from "../Components/Mobile/MobileTagSelectorPage/MobileTagSelectorPage";
import parseLocationSearch from "../logic/parseLocationSearch";
import type { LocationSearch } from "../logic/parseLocationSearch";

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {
    loading: boolean,
    tags: ?Array<string>,
    triggers: ?TriggerList,
    showTagSelector: boolean,
    hasItems: boolean,
    loadedPage: number,
    triggerList: ?Array<Trigger>,
};

class TriggerListContainer extends React.Component<Props, State> {
    props: Props;

    state: State = {
        loading: true,
        showTagSelector: false,
        tags: null,
        triggers: null,
        triggerList: null,
        loadedPage: 0,
        hasItems: true,
    };

    componentDidMount() {
        document.title = "Moira - Triggers";
        this.getData(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
        this.setState({ loading: true });
        this.getData(nextProps);
    }

    render(): React.Node {
        const { loading, tags, triggerList, showTagSelector } = this.state;
        const { location } = this.props;
        const { onlyProblems, tags: parsedTags } = parseLocationSearch(location.search);
        const selectedTags = tags ? intersection(parsedTags, tags) : [];

        if (showTagSelector) {
            return (
                <MobileTagSelectorPage
                    availableTags={tags || []}
                    selectedTags={selectedTags}
                    onlyProblems={onlyProblems}
                    onClose={this.handleCloseTagSelector}
                    onChange={this.handleChangeSelectedTags}
                />
            );
        }
        return (
            <MobileTriggerListPage
                onOpenTagSelector={this.handleOpenTagSelector}
                selectedTags={selectedTags}
                triggers={triggerList}
                loading={loading}
                onLoadMore={() => {
                    this.handleLoadMore();
                }}
            />
        );
    }

    handleLoadMore = async () => {
        const { triggers, hasItems } = this.state;
        const { moiraApi, location } = this.props;
        const { tags, loadedPage, triggerList } = this.state;
        const { onlyProblems, tags: parsedTags } = parseLocationSearch(location.search);
        if (triggers == null) {
            return;
        }
        if (!hasItems || triggers.total <= (triggerList || []).length) {
            return;
        }
        this.setState({ loading: true });
        try {
            const selectedTags = intersection(parsedTags, tags || []);
            const loadedTriggers = await moiraApi.getTriggerList(
                loadedPage + 1,
                onlyProblems,
                selectedTags
            );

            this.setState({
                triggerList: [...(triggerList || []), ...(loadedTriggers.list || [])],
                loadedPage: loadedPage + 1,
                hasItems: (loadedTriggers.list || []).length > 0,
            });
        } catch (error) {
            // ToDo обработать ошибку
        } finally {
            this.setState({ loading: false });
        }
    };

    handleOpenTagSelector = () => {
        this.setState({ showTagSelector: true });
    };

    handleCloseTagSelector = () => {
        this.setState({ showTagSelector: false });
    };

    handleChangeSelectedTags = (nextTags: string[], nextOnlyProblems: boolean) => {
        this.setState({ showTagSelector: false, triggerList: null });
        this.changeLocationSearch({
            tags: nextTags,
            onlyProblems: nextOnlyProblems,
        });
    };

    async getData(props: Props) {
        const { moiraApi, location } = props;
        const { page, onlyProblems, tags: parsedTags } = parseLocationSearch(location.search);
        const localDataString = localStorage.getItem("moiraSettings");
        const { tags: localTags, onlyProblems: localOnlyProblems } =
            typeof localDataString === "string" ? JSON.parse(localDataString) : {};

        let searchToUpdate = null;
        if (parsedTags.length === 0 && localTags && localTags.length) {
            searchToUpdate = { ...(searchToUpdate || {}), tags: localTags };
        }

        if (!onlyProblems && localOnlyProblems) {
            searchToUpdate = { ...(searchToUpdate || {}), onlyProblems: localOnlyProblems };
        }
        if (searchToUpdate != null) {
            this.changeLocationSearch(searchToUpdate);
            return;
        }

        try {
            const { list: allTags } = await moiraApi.getTagList();
            const selectedTags = intersection(parsedTags, allTags);
            const triggers = await moiraApi.getTriggerList(page - 1, onlyProblems, selectedTags);

            if (page > Math.ceil(triggers.total / triggers.size) && triggers.total !== 0) {
                const rightLastPage = Math.ceil(triggers.total / triggers.size) || 1;
                this.changeLocationSearch({ page: rightLastPage });
                return;
            }

            this.setState({
                tags: allTags,
                triggers,
                triggerList: triggers.list,
                loadedPage: 0,
                hasItems: (triggers.list || []).length > 0,
            });
        } catch (error) {
            // ToDo обработать ошибку
        } finally {
            this.setState({ loading: false });
        }
    }

    changeLocationSearch(update: $Shape<LocationSearch>) {
        const { location, history } = this.props;
        const search = {
            ...parseLocationSearch(location.search),
            ...update,
        };
        localStorage.setItem("moiraSettings", JSON.stringify(search));
        history.push(
            `?${queryString.stringify(search, {
                arrayFormat: "index",
                encode: true,
            })}`
        );
    }
}

export default withMoiraApi(TriggerListContainer);
