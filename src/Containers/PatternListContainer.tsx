import React, { useState, useEffect } from "react";
import MoiraApi from "../Api/MoiraApi";
import { Pattern } from "../Domain/Pattern";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import PatternList from "../Components/PatternList/PatternList";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import { setDocumentTitle } from "../helpers/setDocumentTitle";
import { toggleLoading, setError } from "../store/Reducers/UIReducer.slice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { UIState } from "../store/selectors";
import { useSortData } from "../hooks/useSortData";

export type TPatternListContainerProps = { moiraApi: MoiraApi };

const PatternListContainer: React.FC<TPatternListContainerProps> = ({ moiraApi }) => {
    const dispatch = useAppDispatch();
    const { isLoading, error } = useAppSelector(UIState);
    const [list, setList] = useState<Pattern[] | undefined>();
    const { sortedData, sortConfig, handleSort } = useSortData(list ?? [], "metrics");

    useEffect(() => {
        setDocumentTitle("Patterns");
        getData();
    }, []);

    const getData = async () => {
        dispatch(toggleLoading(true));
        try {
            const { list } = await moiraApi.getPatternList();
            setList(list);
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(toggleLoading(false));
        }
    };

    const removePattern = async (pattern: string) => {
        dispatch(toggleLoading(true));
        await moiraApi.delPattern(pattern);
        getData();
    };

    return (
        <Layout loading={isLoading} error={error}>
            <LayoutContent>
                <LayoutTitle>Patterns</LayoutTitle>
                {list && (
                    <PatternList
                        items={sortedData}
                        onSort={handleSort}
                        sortConfig={sortConfig}
                        onRemove={removePattern}
                    />
                )}
            </LayoutContent>
        </Layout>
    );
};

export default withMoiraApi(PatternListContainer);
