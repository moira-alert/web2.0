// @flow
import type { Status } from "./Status";

export type Metric = {|
    state: Status,
    timestamp: number,
    suppressed?: boolean,
    event_timestamp?: number,
    value?: number,
    maintenance?: number,
|};

export type MetricList = {
    [metric: string]: Metric,
};
