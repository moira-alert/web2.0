// @flow
import * as React from "react";
import isEqual from "lodash/isEqual";
import flattenDeep from "lodash/flattenDeep";
import uniq from "lodash/uniq";
import intersection from "lodash/intersection";
import queryString from "query-string";
import type { ContextRouter } from "react-router-dom";
import type { Trigger, TriggerList } from "../../Domain/Trigger";
import type { MoiraUrlParams } from "../../Domain/MoiraUrlParams";
import type { IMoiraApi } from "../../Api/MoiraApi";
import type { Maintenance } from "../../Domain/Maintenance";
import transformPageFromHumanToProgrammer from "../../logic/transformPageFromHumanToProgrammer";
import { withMoiraApi } from "../../Api/MoiraApiInjection";
import { setMetricMaintenance } from "../../Domain/Maintenance";

// ToDo вынести в хелперы
const clearInput = (input: string | Array<string>) => {
    let cleared = Array.isArray(input) ? input.join(" ") : input;

    cleared = cleared.trim();
    cleared = cleared.replace(/[\s]+/g, " ");

    return cleared;
};

type Props = ContextRouter & { moiraApi: IMoiraApi };

type State = {
    loading: boolean,
    error: ?string,
    subscribedTags: string[],
    allTags: string[],
    triggers: ?Array<Trigger>,
    activePage: number,
    pageCount: number,
};

class TriggerListPage extends React.Component<Props, State> {
    state: State = {
        loading: true,
        error: null,
        subscribedTags: [],
        allTags: [],
        triggers: [],
        activePage: 1,
        pageCount: 1,
    };

    componentDidMount() {
        document.title = "Moira - Triggers";
        this.loadData();
    }

    componentDidUpdate({ location: prevLocation }) {
        const { location: currentLocation } = this.props;
        if (!isEqual(prevLocation, currentLocation)) {
            this.loadData();
        }
    }

    static parseLocationSearch(search: string): MoiraUrlParams {
        const START_PAGE = 1;
        const { page, tags, onlyProblems, searchText } = queryString.parse(search, {
            arrayFormat: "index",
        });

        return {
            page: Number.isNaN(Number(page)) ? START_PAGE : Math.abs(parseInt(page, 10)),
            tags: Array.isArray(tags) ? tags.map(value => value.toString()) : [],
            onlyProblems: onlyProblems === "false" ? false : Boolean(onlyProblems),
            searchText: clearInput(searchText || ""),
        };
    }

    render() {
        const { location } = this.props;
        const locationSearch = TriggerListPage.parseLocationSearch(location.search);
        const { onlyProblems, tags, searchText } = locationSearch;

        const {
            loading,
            error,
            subscribedTags,
            allTags,
            triggers,
            activePage,
            pageCount,
        } = this.state;
        const { view: TriggerListView } = this.props;

        return (
            <TriggerListView
                searchText={searchText || ""}
                selectedTags={tags}
                subscribedTags={subscribedTags}
                allTags={allTags}
                onlyProblems={onlyProblems}
                triggers={triggers}
                activePage={activePage}
                pageCount={pageCount}
                loading={loading}
                error={error}
                onChange={this.changeLocationSearch}
                onSetMetricMaintenance={this.setMetricMaintenance}
                onRemoveMetric={this.removeMetric}
            />
        );
    }

    async loadData() {
        const { location, moiraApi } = this.props;
        const locationSearch = TriggerListPage.parseLocationSearch(location.search);
        const redirected = this.loadLocalSettingsAndRedirectIfNeed(
            locationSearch.tags,
            locationSearch.onlyProblems
        );

        if (redirected) return;

        try {
            const [settings, triggers, tags] = await Promise.all([
                moiraApi.getSettings(),
                moiraApi.getTriggerList(
                    transformPageFromHumanToProgrammer(locationSearch.page),
                    locationSearch.onlyProblems,
                    locationSearch.tags,
                    locationSearch.searchText
                ),
                moiraApi.getTagList(),
            ]);

            if (this.compareTagsAndRedirectIfHasUnknownTags(locationSearch.tags, tags.list)) return;
            if (this.checkPageAndRedirectIfNeed(triggers, locationSearch.page)) return;

            this.setState({
                subscribedTags: uniq(flattenDeep(settings.subscriptions.map(item => item.tags))),
                allTags: tags.list,
                triggers: triggers.list,
                activePage: locationSearch.page,
                pageCount: Math.ceil(triggers.total / triggers.size),
                loading: false,
            });
        } catch (error) {
            this.setState({ loading: false, error: error.message });
        }
    }

    checkPageAndRedirectIfNeed(triggers: TriggerList, page: number) {
        const pages = Math.ceil(triggers.total / triggers.size);
        if (page > pages && triggers.total !== 0) {
            const rightLastPage = pages || 1;
            this.changeLocationSearch({ page: rightLastPage });
            return true;
        }
        return false;
    }

    loadLocalSettingsAndRedirectIfNeed(tags: Array<string>, onlyProblems: boolean) {
        const localDataString = localStorage.getItem("moiraSettings");
        const { tags: localTags, onlyProblems: localOnlyProblems } =
            typeof localDataString === "string" ? JSON.parse(localDataString) : {};

        const searchToUpdate = {};
        const isTagParamEnabled = tags.length === 0 && localTags && localTags.length;
        const isOnlyProblemsParamEnabled = !onlyProblems && localOnlyProblems;

        if (isTagParamEnabled) {
            searchToUpdate.tags = localTags;
        }
        if (isOnlyProblemsParamEnabled) {
            searchToUpdate.onlyProblems = localOnlyProblems;
        }
        if (isTagParamEnabled || isOnlyProblemsParamEnabled) {
            this.changeLocationSearch(searchToUpdate);
            return true;
        }
        return false;
    }

    compareTagsAndRedirectIfHasUnknownTags(parsedTags: string[], moiraTags: string[]) {
        const validSelectedTags = intersection(parsedTags, moiraTags);
        if (parsedTags.length > validSelectedTags.length) {
            this.changeLocationSearch({ tags: validSelectedTags });
            return true;
        }
        return false;
    }

    changeLocationSearch = update => {
        const { location, history } = this.props;
        const locationSearch = TriggerListPage.parseLocationSearch(location.search);
        const settings = { ...locationSearch, ...update };
        localStorage.setItem("moiraSettings", JSON.stringify({ ...settings, searchText: "" }));
        history.push(
            `?${queryString.stringify(settings, {
                arrayFormat: "index",
                encode: true,
            })}`
        );
    };

    setMetricMaintenance = async (triggerId: string, metric: string, maintenance: Maintenance) => {
        this.setState({ loading: true });
        const { moiraApi } = this.props;
        setMetricMaintenance(moiraApi, triggerId, metric, maintenance);
    };

    removeMetric = async (triggerId: string, metric: string): Promise<void> => {
        this.setState({ loading: true });
        const { moiraApi } = this.props;
        moiraApi.delMetric(triggerId, metric);
    };
}

export default withMoiraApi(TriggerListPage);
