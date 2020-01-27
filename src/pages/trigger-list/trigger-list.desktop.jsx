// @flow
import * as React from "react";
import difference from "lodash/difference";
import Paging from "retail-ui/components/Paging";
import Toggle from "retail-ui/components/Toggle";
import { getPageLink } from "../../Domain/Global";
import Layout, { LayoutPlate, LayoutContent, LayoutFooter } from "../../Components/Layout/Layout";
import { ColumnStack, RowStack, Fill, Fit } from "../../Components/ItemsStack/ItemsStack";
import SearchSelector from "../../Components/SearchSelector/SearchSelector";
import AddingButton from "../../Components/AddingButton/AddingButton";
import TriggerList from "../../Components/TriggerList/TriggerList";
import type {Maintenance} from "../../Domain/Maintenance";
import {getMaintenanceTime} from "../../Domain/Maintenance";
import moment from "moment";
import parseLocationSearch from "../../logic/parseLocationSearch";

class TriggerListDesktop extends React.Component {
    render() {
        const {
            moiraApi,
            selectedTags,
            subscribedTags,
            allTags,
            onlyProblems,
            triggers,
            activePage,
            pageCount,
            onChange,
            searchText,
            loading,
            error,
        } = this.props;

        return (
            <Layout loading={loading} error={error}>
                <LayoutPlate>
                    <RowStack verticalAlign="baseline" block gap={3}>
                        <Fill>
                            <SearchSelector
                                search={searchText}
                                selectedTokens={selectedTags}
                                subscribedTokens={difference(subscribedTags, selectedTags)}
                                remainingTokens={difference(allTags, selectedTags)}
                                onChange={this.handleChange}
                                onSearch={this.handleSearch}
                            />
                        </Fill>
                        <Fit>
                            <Toggle
                                checked={onlyProblems}
                                onChange={value => onChange({ onlyProblems: value })}
                            />{" "}
                            Only Problems
                        </Fit>
                    </RowStack>
                </LayoutPlate>
                <LayoutContent>
                    <ColumnStack block gap={6} horizontalAlign="stretch">
                        <AddingButton to={getPageLink("triggerAdd")} />
                        <TriggerList
                            searchMode={searchText !== ""}
                            items={triggers}
                            onChange={(triggerId, maintenance, metric) => {
                                console.log("onChange maintenance");
                                this.setMetricMaintenance(triggerId, maintenance, metric);
                            }}
                            onRemove={(triggerId, metric) => {
                                this.removeMetric(triggerId, metric);
                            }}
                        />
                    </ColumnStack>
                </LayoutContent>
                {pageCount > 1 && (
                    <LayoutFooter>
                        <Paging
                            caption="Next page"
                            activePage={activePage}
                            pagesCount={pageCount}
                            onPageChange={page => onChange({ page })}
                            withoutNavigationHint
                        />
                    </LayoutFooter>
                )}
            </Layout>
        );
    }

    handleChange = (tags, searchText) => {
        const { onChange } = this.props;
        onChange({ tags, searchText });
    };

    handleSearch = searchText => {
        const { onChange } = this.props;

        onChange({ searchText });
    };

    async getData(props) {
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

export { TriggerListDesktop as default };