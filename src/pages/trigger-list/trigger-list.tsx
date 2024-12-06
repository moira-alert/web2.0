import React, { useEffect, useState, ComponentType } from "react";
import { RouteComponentProps } from "react-router-dom";
import flattenDeep from "lodash/flattenDeep";
import uniq from "lodash/uniq";
import qs from "qs";
import { TriggerList } from "../../Domain/Trigger";
import { MoiraUrlParams } from "../../Domain/MoiraUrlParams";
import transformPageFromHumanToProgrammer from "../../logic/transformPageFromHumanToProgrammer";
import { TriggerListMobileProps } from "./trigger-list.mobile";
import { TriggerListDesktopProps } from "./trigger-list.desktop";
import { clearInput } from "../../helpers/common";
import { setDocumentTitle } from "../../helpers/setDocumentTitle";
import { useAppSelector } from "../../store/hooks";
import { UIState } from "../../store/selectors";
import { useGetUserSettingsQuery } from "../../services/UserApi";
import { useGetTagsQuery } from "../../services/TagsApi";
import {
    useDeleteMetricMutation,
    useGetTriggerListQuery,
    useSetMetricsMaintenanceMutation,
} from "../../services/TriggerApi";

export type TriggerListUpdate = {
    tags?: string[];
    page?: number;
    searchText?: string;
    onlyProblems?: boolean;
};

export type TriggerListProps = RouteComponentProps & {
    view: ComponentType<TriggerListDesktopProps | TriggerListMobileProps>;
};

const parseLocationSearch = (search: string): MoiraUrlParams => {
    const START_PAGE = 1;
    const { page, tags, onlyProblems, searchText } = qs.parse(search, {
        ignoreQueryPrefix: true,
    });

    return {
        page:
            Number.isNaN(Number(page)) || typeof page !== "string"
                ? START_PAGE
                : Math.abs(parseInt(page, 10)),
        tags: Array.isArray(tags) ? tags.map((value) => value.toString()) : [],
        onlyProblems: onlyProblems === "false" ? false : Boolean(onlyProblems),
        searchText: clearInput(typeof searchText === "string" ? searchText : ""),
    };
};

const changeLocationSearch = (
    history: RouteComponentProps["history"],
    locationSearch: MoiraUrlParams,
    update: TriggerListUpdate
) => {
    const settings = { ...locationSearch, ...update };
    localStorage.setItem("moiraSettings", JSON.stringify({ ...settings, searchText: "" }));
    history.push(`?${qs.stringify(settings, { arrayFormat: "indices", encode: true })}`);
};

const loadLocalSettingsAndRedirectIfNeed = (
    history: RouteComponentProps["history"],
    locationSearch: MoiraUrlParams,
    tags: Array<string>,
    onlyProblems: boolean
) => {
    const localDataString = localStorage.getItem("moiraSettings");
    const { tags: localTags, onlyProblems: localOnlyProblems }: TriggerListUpdate =
        typeof localDataString === "string" ? JSON.parse(localDataString) : {};

    const searchToUpdate: TriggerListUpdate = {};
    const isTagParamEnabled = tags.length === 0 && localTags?.length;
    const isOnlyProblemsParamEnabled = !onlyProblems && localOnlyProblems;

    if (isTagParamEnabled) {
        searchToUpdate.tags = localTags;
    }
    if (isOnlyProblemsParamEnabled) {
        searchToUpdate.onlyProblems = localOnlyProblems;
    }
    if (isTagParamEnabled || isOnlyProblemsParamEnabled) {
        changeLocationSearch(history, locationSearch, searchToUpdate);
        return true;
    }
    return false;
};

const checkPageAndRedirectIfNeeded = (
    triggerList: TriggerList,
    page: number,
    changeLocationSearch: (update: TriggerListUpdate) => void
) => {
    const pages = Math.ceil(triggerList.total / triggerList.size);
    if (page > pages && triggerList.total !== 0) {
        changeLocationSearch({ page: pages || 1 });
        return true;
    }
    return false;
};

const TriggerListPage: React.FC<TriggerListProps> = ({
    view: TriggerListView,
    location,
    history,
}) => {
    const { isLoading, error } = useAppSelector(UIState);
    const [activePage, setActivePage] = useState(1);
    const [pageCount, setPageCount] = useState(1);

    const { data: settings } = useGetUserSettingsQuery();
    const { data: tags } = useGetTagsQuery();
    const locationSearch = parseLocationSearch(location.search);

    const [setMetricMaintenance] = useSetMetricsMaintenanceMutation();
    const [deleteMetric] = useDeleteMetricMutation();

    const { data: triggerList } = useGetTriggerListQuery({
        page: transformPageFromHumanToProgrammer(locationSearch.page),
        onlyProblems: locationSearch.onlyProblems,
        tags: locationSearch.tags,
        searchText: locationSearch.searchText,
    });

    const subscribedTags = uniq(flattenDeep(settings?.subscriptions.map((item) => item.tags)));

    useEffect(() => {
        setDocumentTitle("Triggers");
        const redirected = loadLocalSettingsAndRedirectIfNeed(
            history,
            locationSearch,
            locationSearch.tags,
            locationSearch.onlyProblems
        );

        if (redirected || !triggerList) return;

        if (
            checkPageAndRedirectIfNeeded(triggerList, locationSearch.page, (update) =>
                changeLocationSearch(history, locationSearch, update)
            )
        )
            return;

        setActivePage(locationSearch.page);
        setPageCount(Math.ceil(triggerList.total / triggerList.size));
    }, [triggerList]);

    return (
        <TriggerListView
            searchText={locationSearch.searchText}
            selectedTags={locationSearch.tags}
            subscribedTags={subscribedTags}
            allTags={tags ?? []}
            onlyProblems={locationSearch.onlyProblems}
            triggers={triggerList?.list ?? []}
            activePage={activePage}
            pageCount={pageCount}
            loading={isLoading}
            error={error}
            onChange={(update) => changeLocationSearch(history, locationSearch, update)}
            onSetMetricMaintenance={(triggerId: string, metric: string, maintenance: number) =>
                setMetricMaintenance({
                    triggerId,
                    metrics: { [metric]: maintenance },
                    tagsToInvalidate: ["TriggerList"],
                })
            }
            onRemoveMetric={(triggerId, metric) =>
                deleteMetric({ triggerId, metric, tagsToInvalidate: ["TriggerList"] })
            }
            history={history}
        />
    );
};

export default TriggerListPage;
