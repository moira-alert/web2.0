// @flow
import type { Status } from "./Status";

export type Metric = {|
    state: Status,
    timestamp: number,
    suppressed?: boolean,
    event_timestamp?: number,
    value?: number,
    maintenance?: number,
    maintenance_who: {
        start_user: ?string,
        start_time: ?number,
        stop_user: ?string,
        stop_time: ?number,
    },
|};

export type MetricList = {
    [metric: string]: Metric,
};
