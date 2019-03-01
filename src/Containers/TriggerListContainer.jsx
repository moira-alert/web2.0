// @flow
import * as React from "react";
import queryString from "query-string";
import intersection from "lodash/intersection";
import difference from "lodash/difference";
import isEqual from "lodash/isEqual";
import moment from "moment";
import Paging from "retail-ui/components/Paging";
import Toggle from "retail-ui/components/Toggle";
import TokenInput, { TokenInputType } from "retail-ui/components/TokenInput";
import Token from "retail-ui/components/Token";
import type { ContextRouter } from "react-router-dom";
import { getPageLink } from "../Domain/Global";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import { getMaintenanceTime } from "../Domain/Maintenance";
import type { Config } from "../Domain/Config";
import type { IMoiraApi } from "../Api/MoiraApi";
import type { TriggerList } from "../Domain/Trigger";
import type { Maintenance } from "../Domain/Maintenance";
import Layout, { LayoutPlate, LayoutContent, LayoutFooter } from "../Components/Layout/Layout";
import TriggerListView from "../Components/TriggerList/TriggerList";
import AddingButton from "../Components/AddingButton/AddingButton";
import { ColumnStack, RowStack, Fill, Fit } from "../Components/ItemsStack/ItemsStack";

type Props = ContextRouter & { moiraApi: IMoiraApi };
type State = {
    loading: boolean,
    error: ?string,
    tags: ?Array<string>,
    triggers: ?TriggerList,
    config: ?Config,
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
        tags: null,
        triggers: null,
        config: null,
    };

    componentDidMount() {
        document.title = "Moira - Triggers";
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

    static parseLocationSearch(search: string): LocationSearch {
        const { page, tags, onlyProblems } = queryString.parse(search, { arrayFormat: "index" });
        return {
            page: typeof page === "string" ? Number(page.replace(/\D/g, "")) || 1 : 1,
            tags: Array.isArray(tags) ? tags : [],
            onlyProblems: onlyProblems === "true" || false,
        };
    }

    static needScrollToTop(prevProps: Props, nextProps: Props): boolean {
        const { page: prevPage } = this.parseLocationSearch(prevProps.location.search);
        const { page: nextPage } = this.parseLocationSearch(nextProps.location.search);
        return !isEqual(prevPage, nextPage);
    }

    render(): React.Node {
        const { loading, error, triggers, tags, config } = this.state;
        const { location } = this.props;
        const { page, onlyProblems, tags: parsedTags } = TriggerListContainer.parseLocationSearch(
            location.search
        );
        const selectedTags = tags ? intersection(parsedTags, tags) : [];
        const pageCount = triggers ? Math.ceil(triggers.total / triggers.size) : 1;

        const remainedTags = difference(tags, selectedTags);

        const getItems = query => {
            if (query.trim() === "") {
                return Promise.resolve(remainedTags);
            }

            return Promise.resolve(
                remainedTags
                    .filter(
                        tag =>
                            tag.toLowerCase().includes(query.toLowerCase()) ||
                            tag.toString(10) === query
                    )
                    .sort((a, b) => a.length - b.length)
            );
        };

        return (
            <Layout loading={loading} error={error}>
                <LayoutPlate>
                    <RowStack verticalAlign="baseline" block gap={3}>
                        <Fill>
                            <TokenInput
                                type={TokenInputType.WithReference}
                                width="100%"
                                placeholder="Select a tag for filter triggers"
                                selectedItems={selectedTags}
                                getItems={getItems}
                                onChange={items => this.changeLocationSearch({ tags: items })}
                                renderToken={(item, { isActive, onRemove }) => (
                                    <Token
                                        key={item.toString()}
                                        colors={{
                                            idle: "defaultIdle",
                                            active: "defaultActive",
                                        }}
                                        isActive={isActive}
                                        onRemove={onRemove}
                                    >
                                        {item}
                                    </Token>
                                )}
                                hideMenuIfEmptyInputValue
                            />
                        </Fill>
                        <Fit>
                            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */}
                            <label>
                                <Toggle
                                    checked={onlyProblems}
                                    onChange={checked =>
                                        this.changeLocationSearch({
                                            onlyProblems: checked,
                                        })
                                    }
                                />{" "}
                                Only problems
                            </label>
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
