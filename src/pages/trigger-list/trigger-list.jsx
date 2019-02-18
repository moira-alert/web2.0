// @flow
import * as React from "react";
import isEqual from "lodash/isEqual";
import flattenDeep from "lodash/flattenDeep";
import uniq from "lodash/uniq";
import intersection from "lodash/intersection";
import queryString from "query-string";
import type { MoiraUrlParams } from "../../Domain/MoiraUrlParams";
import transformPageFromHumanToProgrammer from "../../logic/transformPageFromHumanToProgrammer";
import { withMoiraApi } from "../../Api/MoiraApiInjection";

type Props = ContextRouter & { moiraApi: IMoiraApi };

type State = {
    loading: boolean,
    subscriptions: ?Array<any>,
    triggers: ?TriggerList,
    tags: ?Array<string>,
};

class TriggerListPage extends React.Component<Props, State> {
    state: State = {
        loading: true,
    };

    componentDidMount() {
        this.loadData();
    }

    componentDidUpdate({ location: prevLocation }) {
        const { location: curentLocation } = this.props;
        if (!isEqual(prevLocation, curentLocation)) {
            this.loadData();
        }
    }

    static parseLocationSearch(search: string): MoiraUrlParams {
        const START_PAGE = 1;
        const { page, tags, onlyProblems } = queryString.parse(search, { arrayFormat: "index" });

        return {
            page: Number.isNaN(Number(page)) ? START_PAGE : Math.abs(parseInt(page, 10)),
            tags: Array.isArray(tags) ? tags.map(value => value.toString()) : [],
            onlyProblems: onlyProblems === "false" ? false : Boolean(onlyProblems),
        };
    }

    render() {
        const {
            loading,
            selectedTags,
            subscribedTags,
            allTags,
            onlyProblems,
            triggers,
            activePage,
            pageCount,
        } = this.state;
        const { view: TriggerListView } = this.props;

        return loading ? (
            <div>Loading...</div>
        ) : (
            <TriggerListView
                selectedTags={selectedTags}
                subscribedTags={subscribedTags}
                allTags={allTags}
                onlyProblems={onlyProblems}
                triggers={triggers}
                activePage={activePage}
                pageCount={pageCount}
                onChange={this.changeLocationSearch}
            />
        );
    }

    async loadData() {
        const { location, moiraApi } = this.props;
        const locationSearch = TriggerListPage.parseLocationSearch(location.search);
        let tags;

        try {
            tags = await moiraApi.getTagList();
        } catch (error) {
            // ToDo
        }

        const validSelectedTags = intersection(locationSearch.tags, tags.list);

        if (locationSearch.tags.length > validSelectedTags.length) {
            this.changeLocationSearch({ tags: validSelectedTags });
            return;
        }

        try {
            const [settings, triggers] = await Promise.all([
                moiraApi.getSettings(),
                moiraApi.getTriggerList(
                    transformPageFromHumanToProgrammer(locationSearch.page),
                    locationSearch.onlyProblems,
                    locationSearch.tags
                ),
            ]);

            this.setState({
                selectedTags: locationSearch.tags,
                subscribedTags: uniq(flattenDeep(settings.subscriptions.map(item => item.tags))),
                allTags: tags.list,
                onlyProblems: locationSearch.onlyProblems,
                triggers: triggers.list,
                activePage: locationSearch.page,
                pageCount: Math.ceil(triggers.total / triggers.size),
            });
        } catch (error) {
            // ToDo
        } finally {
            this.setState({ loading: false });
        }
    }

    changeLocationSearch = update => {
        const { history, location } = this.props;
        const locationSearch = TriggerListPage.parseLocationSearch(location.search);

        history.push(
            `?${queryString.stringify(
                { ...locationSearch, ...update },
                {
                    arrayFormat: "index",
                    encode: true,
                }
            )}`
        );
    };
}

export default withMoiraApi(TriggerListPage);
