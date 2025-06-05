import React, { useEffect, useState } from "react";
import PatternList from "../Components/PatternList/PatternList";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import { setDocumentTitle } from "../helpers/setDocumentTitle";
import { useAppSelector } from "../store/hooks";
import { UIState } from "../store/selectors";
import { useSortData } from "../hooks/useSortData";
import { useDeletePatternMutation, useGetPatternsQuery } from "../services/PatternsApi";
import { SearchInput } from "../Components/TriggerInfo/Components/SearchInput/SearchInput";
import { Flexbox } from "../Components/Flexbox/FlexBox";

const PatternListContainer: React.FC = () => {
    const { isLoading, error } = useAppSelector(UIState);
    const { data: patterns } = useGetPatternsQuery();
    const [deletePattern] = useDeletePatternMutation();

    const [searchValue, setSearchValue] = useState("");

    const filteredPatterns = (patterns ?? []).filter((item) =>
        item.pattern.toLowerCase().includes(searchValue.toLowerCase())
    );

    const { sortedData, sortConfig, handleSort } = useSortData(filteredPatterns, "metrics");

    useEffect(() => {
        setDocumentTitle("Patterns");
    }, []);

    return (
        <Layout loading={isLoading} error={error}>
            <LayoutContent>
                <LayoutTitle>Patterns</LayoutTitle>
                <Flexbox gap={24}>
                    <SearchInput
                        value={searchValue}
                        width={"100%"}
                        placeholder="Filter by pattern name"
                        onValueChange={setSearchValue}
                        onClear={() => setSearchValue("")}
                    />
                    <PatternList
                        items={sortedData}
                        onSort={handleSort}
                        sortConfig={sortConfig}
                        onRemove={deletePattern}
                    />
                </Flexbox>
            </LayoutContent>
        </Layout>
    );
};

export default PatternListContainer;
