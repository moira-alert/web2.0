// @flow
import type { Status } from "./Status";
import type { MetricList } from "./Metric";
import type { Schedule } from "./Schedule";

export type Trigger = {
    notify_about_new_metrics: boolean,
    id: string,
    name: string,
    targets: Array<string>,
    tags: Array<string>,
    patterns: Array<string>,
    expression: string,
    ttl: number,
    ttl_state: Status,
    throttling: number,
    sched?: Schedule,
    desc?: string,
    trigger_type: "rising" | "falling" | "expression",
    warn_value: number | null,
    error_value: number | null,
    highlights?: {|
        name: string,
    |},
    last_check?: {|
        state: Status,
        timestamp: number,
        metrics: MetricList,
        event_timestamp?: number,
        score: number,
        msg?: string,
        maintenance?: number,
    |},
    timestamp?: number,
    is_remote: boolean,
    alone_metrics?: { [target_id: string]: boolean },
    mute_new_metrics: boolean,
};

export type TriggerList = {|
    list: ?Array<Trigger>,
    page: number,
    size: number,
    total: number,
|};

export type TriggerState = {|
    maintenance: ?number,
    maintenanceInfo?: {
        setup_user: ?string,
        setup_time: number,
    },
    metrics: MetricList,
    timestamp: number,
    state: Status,
    score: number,
    trigger_id: string,
    msg?: string,
|};

const TriggerDataSources = {
    LOCAL: "LOCAL",
    GRAPHITE: "GRAPHITE",
};

export { TriggerDataSources as default };
