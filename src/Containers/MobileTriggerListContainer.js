// @flow
import * as React from "react";
import queryString from "query-string";
import { intersection, flattenDeep, uniq, isEqual } from "lodash";
import moment from "moment";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import { getMaintenanceTime } from "../Domain/Maintenance";
import type { Config } from "../Domain/Config";
import type { ContextRouter } from "react-router-dom";
import type { IMoiraApi } from "../Api/MoiraApi";
import type { TriggerList, Trigger } from "../Domain/Trigger";
import type { Maintenance } from "../Domain/Maintenance";
import MobileTriggerListPage from "../Components/Mobile/MobileTriggerListPage/MobileTriggerListPage";
import MobileTagSelectorPage from "../Components/Mobile/MobileTagSelectorPage/MobileTagSelectorPage";

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {
    loading: boolean,
    error: ?string,
    subscriptions: ?Array<string>,
    subscribedTags: ?Array<string>,
    tags: ?Array<string>,
    triggers: ?TriggerList,
    config: ?Config,
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
        error: null,
        subscriptions: null,
        showTagSelector: false,
        subscribedTags: [],
        tags: null,
        triggers: null,
        triggerList: null,
        config: null,
        loadedPage: 0,
        hasItems: true,
    };

    handleLoadMore = async () => {
        const { moiraApi, location } = this.props;
        const { tags, loadedPage, triggerList } = this.state;
        const { onlyProblems, tags: parsedTags } = this.parseLocationSearch(location.search);
        if (this.state.triggers == null) {
            return;
        }
        if (!this.state.hasItems || this.state.triggers.total <= (triggerList || []).length) {
            return;
        }
        this.setState({ loading: true });
        try {
            const selectedTags = intersection(parsedTags, tags || []);
            const triggers = await moiraApi.getTriggerList(loadedPage + 1, onlyProblems, selectedTags);

            this.setState({
                triggerList: [...(triggerList || []), ...(triggers.list || [])],
                loadedPage: loadedPage + 1,
                hasItems: (triggers.list || []).length > 0,
                subscribedTags: selectedTags,
            });
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ loading: false });
        }
    };

    async getData(props: Props) {
        const { moiraApi, location } = props;
        const { page, onlyProblems, tags: parsedTags } = this.parseLocationSearch(location.search);
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
            const { subscriptions } = await moiraApi.getSettings();
            const subscribedTags = uniq(flattenDeep(subscriptions.map(x => x.tags)));
            const { list: allTags } = await moiraApi.getTagList();
            const config = await moiraApi.getConfig();
            const selectedTags = intersection(parsedTags, allTags);
            const triggers = await moiraApi.getTriggerList(page - 1, onlyProblems, selectedTags);

            if (page > Math.ceil(triggers.total / triggers.size) && triggers.total !== 0) {
                const rightLastPage = Math.ceil(triggers.total / triggers.size) || 1;
                this.changeLocationSearch({ page: rightLastPage });
                return;
            }

            this.setState({
                config: config,
                error: null,
                subscriptions: subscribedTags,
                subscribedTags: subscribedTags,
                tags: allTags,
                triggers: triggers,
                triggerList: triggers.list,
                loadedPage: 0,
                hasItems: (triggers.list || []).length > 0,
            });
        } catch (error) {
            this.setState({ error: error.message });
        } finally {
            this.setState({ loading: false });
        }
    }

    componentDidMount() {
        this.getData(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
        this.setState({ loading: true });
        this.getData(nextProps);
        if (this.needScrollToTop(this.props, nextProps)) {
            try {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: "smooth",
                });
            } catch (e) {
                // Do nothing. Strange unstable exception on chrome
            }
        }
    }

    needScrollToTop(prevProps: Props, nextProps: Props): boolean {
        const { page: prevPage } = this.parseLocationSearch(prevProps.location.search);
        const { page: nextPage } = this.parseLocationSearch(nextProps.location.search);
        return !isEqual(prevPage, nextPage);
    }

    parseLocationSearch(search: string): LocationSearch {
        const {
            page,
            tags,
            onlyProblems,
        }: {
            [key: string]: string | Array<string>,
        } = queryString.parse(search, { arrayFormat: "index" });
        return {
            page: typeof page === "string" ? Number(page.replace(/\D/g, "")) || 1 : 1,
            tags: Array.isArray(tags) ? tags : [],
            onlyProblems: onlyProblems === "true" || false,
        };
    }

    changeLocationSearch(update: $Shape<LocationSearch>) {
        const { location, history } = this.props;
        const search = {
            ...this.parseLocationSearch(location.search),
            ...update,
        };
        localStorage.setItem("moiraSettings", JSON.stringify(search));
        history.push(
            "?" +
                queryString.stringify(search, {
                    arrayFormat: "index",
                    encode: true,
                })
        );
    }

    async setMaintenance(triggerId: string, maintenance: Maintenance, metric: string) {
        this.setState({ loading: true });
        const maintenanceTime = getMaintenanceTime(maintenance);
        await this.props.moiraApi.setMaintenance(triggerId, {
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
        this.setState({ loading: true });
        await this.props.moiraApi.delMetric(triggerId, metric);
        this.getData(this.props);
    }

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

    render(): React.Node {
        const { loading, tags, triggerList } = this.state;
        const { location } = this.props;
        const { onlyProblems, tags: parsedTags } = this.parseLocationSearch(location.search);
        const selectedTags = tags ? intersection(parsedTags, tags) : [];

        if (this.state.showTagSelector) {
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
}

export default withMoiraApi(TriggerListContainer);
