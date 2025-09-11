import { OverrideField } from "../helpers/OverrideField";
import { Status } from "./Status";
import { maintenanceDelta } from "./Trigger";
import { ApiMetricSourceCluster, MoiraMetricState } from "./__generated__/data-contracts";
import _ from "lodash";

export type IMetricSourceCluster = ApiMetricSourceCluster;
export type Metric = OverrideField<MoiraMetricState, "state", Status>;

export type MetricItemList = Record<string, Metric>;

export const isMuted = (metric: { maintenance?: number | null }): boolean =>
    metric.maintenance != null && maintenanceDelta(metric.maintenance) > 0;

export const withoutMuted = (metrics?: MetricItemList): MetricItemList =>
    _.pickBy(metrics, (metric) => !isMuted(metric));

export const withMuted = (metrics?: MetricItemList): MetricItemList =>
    _.pickBy(metrics, (metric) => isMuted(metric));
