import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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

export type TriggerListProps =
    | {
          view: React.ComponentType<TriggerListDesktopProps>;
      }
    | {
          view: React.ComponentType<TriggerListMobileProps>;
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
    navigate: ReturnType<typeof useNavigate>,
    locationSearch: MoiraUrlParams,
    update: TriggerListUpdate
) => {
    const settings = { ...locationSearch, ...update };
    localStorage.setItem("moiraSettings", JSON.stringify({ ...settings, searchText: "" }));
    navigate(`?${qs.stringify(settings, { arrayFormat: "indices", encode: true })}`, {
        replace: true,
    });
};

const loadLocalSettingsAndRedirectIfNeed = (
    navigate: ReturnType<typeof useNavigate>,
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

    if (isTagParamEnabled) searchToUpdate.tags = localTags;
    if (isOnlyProblemsParamEnabled) searchToUpdate.onlyProblems = localOnlyProblems;

    if (isTagParamEnabled || isOnlyProblemsParamEnabled) {
        changeLocationSearch(navigate, locationSearch, searchToUpdate);
        return true;
    }
    return false;
};

const checkPageAndRedirectIfNeeded = (
    triggerList: TriggerList,
    page: number,
    onChange: (update: TriggerListUpdate) => void
) => {
    const pages = Math.ceil((triggerList?.total ?? 0) / (triggerList?.size ?? 1));
    if (page > pages && triggerList.total !== 0) {
        onChange({ page: pages || 1 });
        return true;
    }
    return false;
};

const TriggerListPage: React.FC<TriggerListProps> = ({ view: TriggerListView }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoading, error } = useAppSelector(UIState);
    const [activePage, setActivePage] = useState(1);
    const [pageCount, setPageCount] = useState(1);
    const locationSearch = parseLocationSearch(location.search);

    const { data: settings } = useGetUserSettingsQuery();
    const { data: tags } = useGetTagsQuery();
    const [setMetricMaintenance] = useSetMetricsMaintenanceMutation();
    const [deleteMetric] = useDeleteMetricMutation();

    const { data: triggerList } = useGetTriggerListQuery({
        page: transformPageFromHumanToProgrammer(locationSearch.page),
        onlyProblems: locationSearch.onlyProblems,
        tags: locationSearch.tags,
        searchText: locationSearch.searchText,
    });

    const subscribedTags = uniq(flattenDeep(settings?.subscriptions.map((item) => item.tags)));

    const handleChange = (update: TriggerListUpdate) =>
        changeLocationSearch(navigate, locationSearch, update);

    useEffect(() => {
        setDocumentTitle("Triggers");

        const redirected = loadLocalSettingsAndRedirectIfNeed(
            navigate,
            locationSearch,
            locationSearch.tags,
            locationSearch.onlyProblems
        );

        if (redirected || !triggerList) return;

        if (checkPageAndRedirectIfNeeded(triggerList, locationSearch.page, handleChange)) return;

        setActivePage(locationSearch.page);
        setPageCount(Math.ceil((triggerList?.total ?? 0) / (triggerList?.size ?? 1)));
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
            onChange={handleChange}
            onSetMetricMaintenance={(triggerId, metric, maintenance) =>
                setMetricMaintenance({
                    triggerId,
                    metrics: { [metric]: maintenance },
                    tagsToInvalidate: ["TriggerList"],
                })
            }
            onRemoveMetric={(triggerId, metric) =>
                deleteMetric({ triggerId, metric, tagsToInvalidate: ["TriggerList"] })
            }
        />
    );
};

export default TriggerListPage;
