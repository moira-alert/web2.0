import React, { useEffect, FC, useState } from "react";
import { Layout, LayoutContent, LayoutTitle } from "../../Components/Layout/Layout";
import { setDocumentTitle } from "../../helpers/setDocumentTitle";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";
import { useGetAllTeamsQuery } from "../../services/TeamsApi";
import { Flexbox } from "../../Components/Flexbox/FlexBox";
import { SearchInput } from "../../Components/TriggerInfo/Components/SearchInput/SearchInput";
import { useDebounce } from "../../hooks/useDebounce";
import { Paging } from "@skbkontur/react-ui/components/Paging";
import transformPageFromHumanToProgrammer from "../../logic/transformPageFromHumanToProgrammer";
import { Select } from "@skbkontur/react-ui/components/Select";
import { setError } from "../../store/Reducers/UIReducer.slice";
import { TeamsList } from "../../Components/TeamsList/TeamsList";
import { useQueryState } from "../../hooks/useQueryState";

type SortDirection = "asc" | "desc";

const SORT_OPTIONS: Array<[SortDirection, string]> = [
    ["asc", "Name: A-Z"],
    ["desc", "Name: Z-A"],
];

const AllTeamsContainer: FC = () => {
    const { error, isLoading } = useAppSelector(UIState);
    const [searchValue, setSearchValue] = useQueryState<string>("team", "");
    const [activePage, setActivePage] = useState(1);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const debouncedSearchMetric = useDebounce(searchValue, 500);
    const dispatch = useAppDispatch();

    const { data: teams } = useGetAllTeamsQuery({
        page: transformPageFromHumanToProgrammer(activePage),
        searchText: debouncedSearchMetric,
        sort: sortDirection,
    });

    const pageCount = Math.ceil((teams?.total ?? 0) / (teams?.size ?? 1));

    const handleSetSearchValue = (value: string) => {
        dispatch(setError(null));
        setSearchValue(value);
    };

    useEffect(() => {
        setDocumentTitle("All Teams");
    }, []);

    return (
        <Layout loading={isLoading} error={error}>
            <LayoutContent>
                <LayoutTitle>Teams</LayoutTitle>
                <Flexbox gap={24}>
                    <Flexbox gap={16} direction="row">
                        <SearchInput
                            value={searchValue}
                            width={"100%"}
                            placeholder="Filter by team name or team id, regExp is supported"
                            onValueChange={handleSetSearchValue}
                            onClear={() => setSearchValue("")}
                        />
                        <Select<SortDirection, string>
                            placeholder="Sort"
                            value={sortDirection}
                            renderItem={(_v, item) => item}
                            renderValue={(_v, item) => item}
                            onValueChange={setSortDirection}
                            items={SORT_OPTIONS}
                        />
                    </Flexbox>

                    <TeamsList teams={teams?.list} />

                    <Paging
                        caption="Next page"
                        activePage={activePage}
                        pagesCount={pageCount}
                        onPageChange={setActivePage}
                        withoutNavigationHint
                    />
                </Flexbox>
            </LayoutContent>
        </Layout>
    );
};

export default AllTeamsContainer;
