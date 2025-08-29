import { NotifierSourceState } from "../Domain/MoiraServiceStates";

export const sortMetricSources = (a: NotifierSourceState, b: NotifierSourceState): number => {
    return `${a.cluster_id}_${a.trigger_source}`.localeCompare(
        `${b.cluster_id}_${b.trigger_source}`,
        undefined,
        { numeric: true, sensitivity: "base" }
    );
};

export const filterMetricSources = (
    sources: NotifierSourceState[] | undefined,
    keyword: string
): NotifierSourceState[] => {
    if (!sources) return [];
    return sources.filter((s) => s.trigger_source.toLowerCase().includes(keyword.toLowerCase()));
};
