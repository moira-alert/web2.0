import React, { useEffect, FC, useState } from "react";
import { Layout, LayoutContent, LayoutTitle } from "../../Components/Layout/Layout";
import { setDocumentTitle } from "../../helpers/setDocumentTitle";
import { useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";
import { useGetAllTeamsQuery } from "../../services/TeamsApi";
import classNames from "classnames/bind";
import { Team } from "../../Domain/Team";
import { Flexbox } from "../../Components/Flexbox/FlexBox";
import { SearchInput } from "../../Components/TriggerInfo/Components/SearchInput/SearchInput";
import { useDebounce } from "../../hooks/useDebounce";
import { Paging } from "@skbkontur/react-ui/components/Paging";
import transformPageFromHumanToProgrammer from "../../logic/transformPageFromHumanToProgrammer";
import { Select } from "@skbkontur/react-ui/components/Select";
import { EmptyListText } from "../../Components/TriggerInfo/Components/EmptyListMessage/EmptyListText";
import { TeamCard } from "../../Components/Teams/TeamCard/TeamCard";

import styles from "./AllTeamsContainer.less";

const cn = classNames.bind(styles);

type SortDirection = "asc" | "desc";

const SORT_OPTIONS: Array<[SortDirection, string]> = [
    ["asc", "Name: A-Z"],
    ["desc", "Name: Z-A"],
];

const AllTeamsContainer: FC = () => {
    const { error, isLoading } = useAppSelector(UIState);
    const [deletingTeam, setDeletingTeam] = useState<Team | null>(null);
    const [searchValue, setSearchValue] = useState<string>("");
    const [activePage, setActivePage] = useState<number>(1);
    const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
    const debouncedSearchMetric = useDebounce(searchValue, 500);

    const { data: teams } = useGetAllTeamsQuery({
        page: transformPageFromHumanToProgrammer(activePage),
        searchText: debouncedSearchMetric,
        sort: sortDirection,
    });

    const pageCount = Math.ceil((teams?.total ?? 0) / (teams?.size ?? 1));

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
                            onValueChange={setSearchValue}
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
                    {teams?.list.length !== 0 ? (
                        <div className={cn("teams-container")}>
                            {teams?.list.map((team) => (
                                <TeamCard
                                    key={team.id}
                                    team={team}
                                    isDeleting={deletingTeam?.id === team.id}
                                    onOpenDelete={() => setDeletingTeam(team)}
                                    onCloseDelete={() => setDeletingTeam(null)}
                                />
                            ))}
                        </div>
                    ) : (
                        <EmptyListText text={"There are no teams"} />
                    )}
                    {teams?.list.length !== 0 && (
                        <Paging
                            caption="Next page"
                            activePage={activePage}
                            pagesCount={pageCount}
                            onPageChange={setActivePage}
                            withoutNavigationHint
                        />
                    )}
                </Flexbox>
            </LayoutContent>
        </Layout>
    );
};

export default AllTeamsContainer;
