import { Statuses } from "./Status";

export type Metric = {
    state: Statuses;
    timestamp: number;
    suppressed?: boolean;
    event_timestamp?: number;
    value?: number;
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
