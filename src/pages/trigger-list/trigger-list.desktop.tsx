import React, { FC } from "react";
import difference from "lodash/difference";
import { Paging } from "@skbkontur/react-ui/components/Paging";
import { Toggle } from "@skbkontur/react-ui/components/Toggle";
import { getPageLink } from "../../Domain/Global";
import { Trigger } from "../../Domain/Trigger";
import { Layout, LayoutPlate, LayoutContent, LayoutFooter } from "../../Components/Layout/Layout";
import { ColumnStack, RowStack, Fill, Fit } from "../../Components/ItemsStack/ItemsStack";
import { SearchSelector } from "../../Components/SearchSelector/SearchSelector";
import AddingButton from "../../Components/AddingButton/AddingButton";
import TriggerList from "../../Components/TriggerList/TriggerList";
import { TriggerListUpdate } from "./trigger-list";
import { useTheme } from "../../shared/themes";
import { useHistory } from "react-router";

export type TriggerListDesktopProps = {
    selectedTags: string[];
    subscribedTags: string[];
    allTags: string[];
    onlyProblems: boolean;
    triggers: Array<Trigger>;
    activePage: number;
    pageCount: number;
    onChange: (update: TriggerListUpdate) => void;
    searchText: string;
    loading: boolean;
    error?: string;
    onSetMetricMaintenance: (triggerId: string, metric: string, maintenance: number) => void;
    onRemoveMetric: (triggerId: string, metric: string) => void;
};

const TriggerListDesktop: FC<TriggerListDesktopProps> = ({
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
    onSetMetricMaintenance,
    onRemoveMetric,
}) => {
    const theme = useTheme();
    const history = useHistory();

    const handlePageChange = (page: number): void => {
        onChange({ page });
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handleChange = (tags: string[], searchText: string): void => {
        onChange({ tags, searchText });
    };

    const handleSearch = (searchText: string): void => {
        onChange({ searchText });
    };

    return (
        <Layout loading={loading} error={error}>
            <LayoutPlate>
                <RowStack verticalAlign="baseline" block gap={3}>
                    <Fill>
                        <SearchSelector
                            search={searchText}
                            allTags={allTags}
                            loading={loading}
                            selectedTokens={selectedTags}
                            subscribedTokens={difference(subscribedTags, selectedTags)}
                            remainingTokens={difference(allTags, selectedTags)}
                            onChange={handleChange}
                            onSearch={handleSearch}
                        />
                    </Fill>
                    <Fit style={{ color: theme.textColorDefault }}>
                        <Toggle
                            checked={onlyProblems}
                            onValueChange={(value: boolean) => onChange({ onlyProblems: value })}
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
                        onChange={onSetMetricMaintenance}
                        onRemove={onRemoveMetric}
                        history={history}
                    />
                </ColumnStack>
            </LayoutContent>
            {pageCount > 1 && (
                <LayoutFooter>
                    <Paging
                        caption="Next page"
                        activePage={activePage}
                        pagesCount={pageCount}
                        onPageChange={handlePageChange}
                        withoutNavigationHint
                    />
                </LayoutFooter>
            )}
        </Layout>
    );
};

export default TriggerListDesktop;
