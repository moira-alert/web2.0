import type { ComponentType, FC } from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import flattenDeep from "lodash/flattenDeep";
import uniq from "lodash/uniq";
import transformPageFromHumanToProgrammer from "../../logic/transformPageFromHumanToProgrammer";
import { TriggerListMobileProps } from "./trigger-list.mobile";
import { TriggerListDesktopProps } from "./trigger-list.desktop";
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
import {
    changeLocationSearch,
    redirectIfPageOutOfRange,
    shouldSyncSearchParamsWithStorage,
    parseLocationSearch,
} from "./trigger-list.helpers";

export type TriggerListUpdate = {
    tags?: string[];
    page?: number;
    searchText?: string;
    onlyProblems?: boolean;
};

export type TriggerListProps =
    | {
          view: ComponentType<TriggerListDesktopProps>;
      }
    | {
          view: ComponentType<TriggerListMobileProps>;
      };

const TriggerListPage: FC<TriggerListProps> = ({ view: TriggerListView }) => {
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
        teamID: locationSearch.teamID,
    });

    const subscribedTags = uniq(flattenDeep(settings?.subscriptions.map((item) => item.tags)));

    const handleChange = (update: TriggerListUpdate) =>
        changeLocationSearch(navigate, locationSearch, update);

    useEffect(() => {
        setDocumentTitle("Triggers");

        const redirected = shouldSyncSearchParamsWithStorage(
            navigate,
            locationSearch,
            locationSearch.tags,
            locationSearch.onlyProblems
        );

        if (redirected || !triggerList) return;

        if (redirectIfPageOutOfRange(triggerList, locationSearch.page, handleChange)) return;

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
