// @flow
import * as React from "react";
import queryString from "query-string";
import intersection from "lodash/intersection";
import isEqual from "lodash/isEqual";
import moment from "moment";
import type { ContextRouter } from "react-router-dom";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import { getMaintenanceTime } from "../Domain/Maintenance";
import type { IMoiraApi } from "../Api/MoiraApi";
import type { TriggerList, Trigger } from "../Domain/Trigger";
import type { Maintenance } from "../Domain/Maintenance";
import MobileTriggerListPage from "../Components/Mobile/MobileTriggerListPage/MobileTriggerListPage";
import MobileTagSelectorPage from "../Components/Mobile/MobileTagSelectorPage/MobileTagSelectorPage";

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

type LocationSearch = {|
    page: number,
    tags: Array<string>,
    onlyProblems: boolean,
|};

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
        this.getData(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
        this.setState({ loading: true });
        this.getData(nextProps);
        if (TriggerListContainer.needScrollToTop(this.props, nextProps)) {
            try {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth",
                });
            } catch (error) {
                // ToDo разобраться, зачем здесь эта конструкция и удалить её
            }
        }
    }

    static needScrollToTop(prevProps: Props, nextProps: Props): boolean {
        const { page: prevPage } = this.parseLocationSearch(prevProps.location.search);
        const { page: nextPage } = this.parseLocationSearch(nextProps.location.search);
        return !isEqual(prevPage, nextPage);
    }

    static parseLocationSearch(search: string): LocationSearch {
        const { page, tags, onlyProblems } = queryString.parse(search, { arrayFormat: "index" });
        return {
            page: typeof page === "string" ? Number(page.replace(/\D/g, "")) || 1 : 1,
            tags: Array.isArray(tags) ? tags : [],
            onlyProblems: onlyProblems === "true" || false,
        };
    }

    render(): React.Node {
        const { loading, tags, triggerList, showTagSelector } = this.state;
        const { location } = this.props;
        const { onlyProblems, tags: parsedTags } = TriggerListContainer.parseLocationSearch(
            location.search
        );
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
        const { onlyProblems, tags: parsedTags } = TriggerListContainer.parseLocationSearch(
            location.search
        );
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
        const { page, onlyProblems, tags: parsedTags } = TriggerListContainer.parseLocationSearch(
            location.search
        );
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
            ...TriggerListContainer.parseLocationSearch(location.search),
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

    async setMaintenance(triggerId: string, maintenance: Maintenance, metric: string) {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        const maintenanceTime = getMaintenanceTime(maintenance);
        await moiraApi.setMaintenance(triggerId, {
            [metric]:
                maintenanceTime > 0
                    ? moment
                          .utc()
                          .add(maintenanceTime, "minutes")
                          .unix()
                    : maintenanceTime,
        });
        this.getData(this.props);
    }

    async removeMetric(triggerId: string, metric: string) {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        await moiraApi.delMetric(triggerId, metric);
        this.getData(this.props);
    }
}

export default withMoiraApi(TriggerListContainer);
