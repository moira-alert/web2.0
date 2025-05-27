import { Status } from "./Status";
import TriggerSource, { maintenanceDelta } from "./Trigger";
import _ from "lodash";

export type Metric = {
    state: Status;
    timestamp: number;
    suppressed?: boolean;
    event_timestamp?: number;
    values?: {
        [metric: string]: number;
    };
    maintenance?: number;
    maintenance_info?: {
        setup_user?: string | null;
        setup_time?: number | null;
    };
};

export type MetricItemList = {
    [metric: string]: Metric;
};

export type TMetricSourceCluster = {
    trigger_source: TriggerSource;
    cluster_id: string;
    cluster_name: string;
    metrics_ttl: number;
};

export const isMuted = (metric: { maintenance?: number | null }): boolean =>
    metric.maintenance != null && maintenanceDelta(metric.maintenance) > 0;

export const withoutMuted = (metrics?: MetricItemList): MetricItemList =>
    _.pickBy(metrics, (metric) => !isMuted(metric));

export const withMuted = (metrics?: MetricItemList): MetricItemList =>
    _.pickBy(metrics, (metric) => isMuted(metric));
