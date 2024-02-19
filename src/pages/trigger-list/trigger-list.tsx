import React, { ComponentType, ReactElement } from "react";
import { RouteComponentProps } from "react-router-dom";
import isEqual from "lodash/isEqual";
import flattenDeep from "lodash/flattenDeep";
import uniq from "lodash/uniq";
import queryString from "query-string";
import { withMoiraApi } from "../../Api/MoiraApiInjection";
import { Trigger, TriggerList } from "../../Domain/Trigger";
import { MoiraUrlParams } from "../../Domain/MoiraUrlParams";
import { setMetricMaintenance } from "../../Domain/Maintenance";
import transformPageFromHumanToProgrammer from "../../logic/transformPageFromHumanToProgrammer";
import { TriggerListMobileProps } from "./trigger-list.mobile";
import { TriggerListDesktopProps } from "./trigger-list.desktop";
import MoiraApi from "../../Api/MoiraApi";
import { clearInput } from "../../helpers/common";
import { setDocumentTitle } from "../../helpers/setDocumentTitle";

export type TriggerListUpdate = {
    tags?: Array<string>;
    page?: number;
    searchText?: string;
    onlyProblems?: boolean;
};

export type TriggerListProps = RouteComponentProps & {
    view: ComponentType<TriggerListDesktopProps | TriggerListMobileProps>;
    moiraApi: MoiraApi;
};

type State = {
    loading: boolean;
    error?: string;
    subscribedTags: string[];
    allTags: string[];
    triggers: Trigger[];
    activePage: number;
    pageCount: number;
};

class TriggerListPage extends React.Component<TriggerListProps, State> {
    state: State = {
        loading: true,
        subscribedTags: [],
        allTags: [],
        triggers: [],
        activePage: 1,
        pageCount: 1,
    };

    componentDidMount() {
        setDocumentTitle("Triggers");
        this.loadData();
    }

    componentDidUpdate({ location: prevLocation }: TriggerListProps): void {
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
            page:
                Number.isNaN(Number(page)) || typeof page !== "string"
                    ? START_PAGE
                    : Math.abs(parseInt(page, 10)),
            tags: Array.isArray(tags) ? tags.map((value) => value.toString()) : [],
            onlyProblems: onlyProblems === "false" ? false : Boolean(onlyProblems),
            searchText: clearInput(searchText || ""),
        };
    }

    public render(): ReactElement {
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
                searchText={searchText}
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
                history={this.props.history}
            />
        );
    }

    private async loadData() {
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

            if (this.checkPageAndRedirectIfNeed(triggers, locationSearch.page)) return;

            this.setState({
                subscribedTags: uniq(flattenDeep(settings.subscriptions.map((item) => item.tags))),
                allTags: tags.list,
                // TODO: check getTriggerList always return trigger list?
                triggers: triggers.list ?? [],
                activePage: locationSearch.page,
                pageCount: Math.ceil(triggers.total / triggers.size),
                loading: false,
            });
        } catch (error) {
            this.setState({ loading: false, error: error.message });
        }
    }

    checkPageAndRedirectIfNeed(triggers: TriggerList, page: number): boolean {
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
        const { tags: localTags, onlyProblems: localOnlyProblems }: TriggerListUpdate =
            typeof localDataString === "string" ? JSON.parse(localDataString) : {};

        const searchToUpdate: TriggerListUpdate = {};
        const isTagParamEnabled = tags.length === 0 && localTags?.length;
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

    changeLocationSearch = (update: TriggerListUpdate) => {
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

    setMetricMaintenance = async (triggerId: string, metric: string, maintenance: number) => {
        this.setState({ loading: true });
        const { moiraApi } = this.props;
        setMetricMaintenance(moiraApi, triggerId, metric, maintenance);
    };

    removeMetric = async (triggerId: string, metric: string): Promise<void> => {
        this.setState({ loading: true });
        const { moiraApi } = this.props;
        await moiraApi.delMetric(triggerId, metric);
    };
}

export default withMoiraApi(TriggerListPage);
