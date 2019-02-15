// @flow
import * as React from "react";
import queryString from "query-string";
import intersection from "lodash/intersection";
import concat from "lodash/concat";
import difference from "lodash/difference";
import flattenDeep from "lodash/flattenDeep";
import uniq from "lodash/uniq";
import isEqual from "lodash/isEqual";
import moment from "moment";
import Paging from "retail-ui/components/Paging";
import type { ContextRouter } from "react-router-dom";
import { getPageLink } from "../Domain/Global";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import { getMaintenanceTime } from "../Domain/Maintenance";
import type { Config } from "../Domain/Config";
import type { IMoiraApi } from "../Api/MoiraApi";
import type { TriggerList } from "../Domain/Trigger";
import type { Maintenance } from "../Domain/Maintenance";
import ToggleWithLabel from "../Components/Toggle/Toggle";
import Layout, { LayoutPlate, LayoutContent, LayoutFooter } from "../Components/Layout/Layout";
import TagDropdownSelect2 from "../Components/TagDropdownSelect2/TagDropdownSelect2";
import TriggerListView from "../Components/TriggerList/TriggerList";
import AddingButton from "../Components/AddingButton/AddingButton";
import { ColumnStack, RowStack, Fill, Fit } from "../Components/ItemsStack/ItemsStack";
import parseLocationSearch from "../logic/parseLocationSearch";
import type { LocationSearch } from "../logic/parseLocationSearch";

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {
    loading: boolean,
    error: ?string,
    subscriptions: ?Array<string>,
    tags: ?Array<string>,
    triggers: ?TriggerList,
    config: ?Config,
};

class TriggerListContainer extends React.Component<Props, State> {
    props: Props;

    state: State = {
        loading: true,
        error: null,
        subscriptions: null,
        tags: null,
        triggers: null,
        config: null,
    };

    componentDidMount() {
        this.getData(this.props);
    }

    componentWillReceiveProps(nextProps: Props) {
        this.setState({ loading: true });
        this.getData(nextProps);
        if (TriggerListContainer.needScrollToTop(this.props, nextProps)) {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "smooth",
            });
        }
    }

    static needScrollToTop(prevProps: Props, nextProps: Props): boolean {
        const { page: prevPage } = parseLocationSearch(prevProps.location.search);
        const { page: nextPage } = parseLocationSearch(nextProps.location.search);
        return !isEqual(prevPage, nextPage);
    }

    render(): React.Node {
        const { loading, error, triggers, tags, subscriptions, config } = this.state;
        const { location } = this.props;
        const { page, onlyProblems, tags: parsedTags } = parseLocationSearch(location.search);
        const selectedTags = tags ? intersection(parsedTags, tags) : [];
        const subscribedTags = subscriptions ? difference(subscriptions, selectedTags) : [];
        const remainedTags = difference(tags, concat(selectedTags, subscribedTags));
        const pageCount = triggers ? Math.ceil(triggers.total / triggers.size) : 1;

        return (
            <Layout loading={loading} error={error}>
                <LayoutPlate>
                    <RowStack verticalAlign="baseline" block gap={3}>
                        <Fill>
                            <TagDropdownSelect2
                                width="100%"
                                selected={selectedTags}
                                subscribed={subscribedTags}
                                remained={remainedTags}
                                onSelect={tag =>
                                    this.changeLocationSearch({
                                        tags: concat(selectedTags, [tag]),
                                    })
                                }
                                onRemove={tag =>
                                    this.changeLocationSearch({
                                        tags: difference(selectedTags, [tag]),
                                    })
                                }
                            />
                        </Fill>
                        <Fit>
                            <ToggleWithLabel
                                checked={onlyProblems}
                                label="Only Problems"
                                onChange={checked =>
                                    this.changeLocationSearch({
                                        onlyProblems: checked,
                                    })
                                }
                            />
                        </Fit>
                    </RowStack>
                </LayoutPlate>
                {triggers && config != null && (
                    <LayoutContent>
                        <ColumnStack block gap={6} horizontalAlign="stretch">
                            <AddingButton to={getPageLink("triggerAdd")} />
                            <TriggerListView
                                items={triggers.list || []}
                                onChange={(triggerId, maintenance, metric) => {
                                    this.setMetricMaintenance(triggerId, maintenance, metric);
                                }}
                                onRemove={(triggerId, metric) => {
                                    this.removeMetric(triggerId, metric);
                                }}
                            />
                        </ColumnStack>
                    </LayoutContent>
                )}
                {pageCount > 1 && (
                    <LayoutFooter>
                        <Paging
                            caption="Next page"
                            activePage={page}
                            pagesCount={pageCount}
                            onPageChange={p => this.changeLocationSearch({ page: p })}
                            withoutNavigationHint
                        />
                    </LayoutFooter>
                )}
            </Layout>
        );
    }

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
            const { subscriptions } = await moiraApi.getSettings();
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
                config,
                error: null,
                subscriptions: uniq(flattenDeep(subscriptions.map(x => x.tags))),
                tags: allTags,
                triggers,
            });
        } catch (error) {
            this.setState({ error: error.message });
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

    async setMetricMaintenance(triggerId: string, maintenance: Maintenance, metric: string) {
        const { moiraApi } = this.props;
        this.setState({ loading: true });
        const maintenanceTime = getMaintenanceTime(maintenance);
        await moiraApi.setMaintenance(triggerId, {
            metrics: {
                [metric]:
                    maintenanceTime > 0
                        ? moment
                              .utc()
                              .add(maintenanceTime, "minutes")
                              .unix()
                        : maintenanceTime,
            },
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
