// @flow
/* eslint-disable react/jsx-filename-extension */
import * as React from "react";
import concat from "lodash/concat";
import difference from "lodash/difference";
import Paging from "retail-ui/components/Paging";
import Toggle from "retail-ui/components/Toggle";
import { getPageLink } from "../../Domain/Global";
import Layout, { LayoutPlate, LayoutContent, LayoutFooter } from "../../Components/Layout/Layout";
import { ColumnStack, RowStack, Fill, Fit } from "../../Components/ItemsStack/ItemsStack";
import TagDropdownSelect2 from "../../Components/TagDropdownSelect2/TagDropdownSelect2";
import AddingButton from "../../Components/AddingButton/AddingButton";
import TriggerList from "../../Components/TriggerList/TriggerList";

function TriggerListDesktop(props) {
    const {
        selectedTags,
        subscribedTags,
        allTags,
        onlyProblems,
        triggers,
        activePage,
        pageCount,
        onChange,
    } = props;
    return (
        <Layout>
            <LayoutPlate>
                <RowStack verticalAlign="baseline" block gap={3}>
                    <Fill>
                        <TagDropdownSelect2
                            width="100%"
                            selected={selectedTags}
                            subscribed={difference(subscribedTags, selectedTags)}
                            remained={difference(allTags, concat(selectedTags, subscribedTags))}
                            onSelect={tag => onChange({ tags: concat(selectedTags, [tag]) })}
                            onRemove={tag => onChange({ tags: difference(selectedTags, [tag]) })}
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
                    <TriggerList items={triggers} onChange={() => {}} onRemove={() => {}} />
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

export { TriggerListDesktop as default };
