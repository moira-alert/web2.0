import { Status } from "./Status";

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
