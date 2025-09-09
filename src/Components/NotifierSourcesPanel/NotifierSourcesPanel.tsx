import React, { FC, useMemo } from "react";
import { NotifierSourcesList } from "../NotifierSourcesList/NotifierSourcesList";
import { DeleteFilteredNotifications } from "../DeleteFilteredNotifications";
import { useGetNotifierSourcesStateQuery } from "../../services/NotifierApi";
import { filterMetricSources, sortMetricSources } from "../../helpers/sortFilterMetricSources";

export const NotifierSourcesPanel: FC = () => {
    const { data: notifierSourcesState } = useGetNotifierSourcesStateQuery();

    const sortedSources = useMemo(() => {
        if (!notifierSourcesState) return [];
        return [...notifierSourcesState].sort(sortMetricSources);
    }, [notifierSourcesState]);

    const { graphiteGroup, prometheusGroup, clusterKeys } = useMemo(() => {
        if (!sortedSources.length)
            return { graphiteGroup: [], prometheusGroup: [], clusterKeys: [] };

        return {
            graphiteGroup: filterMetricSources(sortedSources, "graphite"),
            prometheusGroup: filterMetricSources(sortedSources, "prometheus"),
            clusterKeys: sortedSources.map((s) => `${s.trigger_source}.${s.cluster_id}`),
        };
    }, [sortedSources]);

    return (
        <>
            <NotifierSourcesList graphiteGroup={graphiteGroup} prometheusGroup={prometheusGroup} />
            <DeleteFilteredNotifications clusterKeys={clusterKeys} />
        </>
    );
};
