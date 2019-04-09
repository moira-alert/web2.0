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

class TriggerListDesktop extends React.Component {
    render() {
        const {
            selectedTags,
            subscribedTags,
            allTags,
            onlyProblems,
            triggers,
            activePage,
            pageCount,
            onChange,
            searchText,
        } = this.props;

        return (
            <Layout>
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
                            onChange={() => {}}
                            onRemove={() => {}}
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
}

export { TriggerListDesktop as default };
