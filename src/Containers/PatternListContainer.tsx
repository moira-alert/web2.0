import React, { useEffect } from "react";
import PatternList from "../Components/PatternList/PatternList";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import { setDocumentTitle } from "../helpers/setDocumentTitle";
import { useAppSelector } from "../store/hooks";
import { UIState } from "../store/selectors";
import { useSortData } from "../hooks/useSortData";
import { useDeletePatternMutation, useGetPatternsQuery } from "../services/PatternsApi";

const PatternListContainer: React.FC = () => {
    const { isLoading, error } = useAppSelector(UIState);
    const { data: patterns } = useGetPatternsQuery();
    const [deletePattern] = useDeletePatternMutation();

    const { sortedData, sortConfig, handleSort } = useSortData(patterns ?? [], "metrics");

    useEffect(() => {
        setDocumentTitle("Patterns");
    }, []);

    return (
        <Layout loading={isLoading} error={error}>
            <LayoutContent>
                <LayoutTitle>Patterns</LayoutTitle>
                {
                    <PatternList
                        items={sortedData}
                        onSort={handleSort}
                        sortConfig={sortConfig}
                        onRemove={deletePattern}
                    />
                }
            </LayoutContent>
        </Layout>
    );
};

export default PatternListContainer;
