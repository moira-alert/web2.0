// @flow
import type { Status } from "./Status";

export type Metric = {|
    state: Status,
    timestamp: number,
    suppressed?: boolean,
    event_timestamp?: number,
    value?: number,
    maintenance?: number,
    maintenance_info?: {
        setup_user: ?string,
        setup_time: ?number,
    },
|};

export type MetricList = {
    [metric: string]: Metric,
};
