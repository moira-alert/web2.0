// @flow
import * as React from "react";
import difference from "lodash/difference";
import Paging from "retail-ui/components/Paging";
import Toggle from "retail-ui/components/Toggle";
import TokenInput, { TokenInputType } from "retail-ui/components/TokenInput";
import Token from "retail-ui/components/Token";
import { getPageLink } from "../../Domain/Global";
import Layout, { LayoutPlate, LayoutContent, LayoutFooter } from "../../Components/Layout/Layout";
import { ColumnStack, RowStack, Fill, Fit } from "../../Components/ItemsStack/ItemsStack";
import AddingButton from "../../Components/AddingButton/AddingButton";
import TriggerList from "../../Components/TriggerList/TriggerList";

function TriggerListDesktop(props) {
    const {
        selectedTags,
        allTags,
        onlyProblems,
        triggers,
        activePage,
        pageCount,
        onChange,
    } = props;

    const items = difference(allTags, selectedTags);

    const getItems = query => {
        if (query.trim() === "") {
            return Promise.resolve(items);
        }

        return Promise.resolve(
            items.filter(x => x.toLowerCase().indexOf(query.toLowerCase()) !== -1)
        );
    };

    return (
        <Layout>
            <LayoutPlate>
                <RowStack verticalAlign="baseline" block gap={3}>
                    <Fill>
                        <TokenInput
                            type={TokenInputType.WithReference}
                            width="100%"
                            placeholder="Select a tag for filter triggers"
                            selectedItems={selectedTags}
                            getItems={getItems}
                            onChange={tags => onChange({ tags })}
                            renderToken={(item, { onRemove }) => (
                                <Token key={item.toString()} onRemove={onRemove}>
                                    {item}
                                </Token>
                            )}
                            hideMenuIfEmptyInputValue
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
