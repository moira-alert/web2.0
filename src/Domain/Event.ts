import { Status } from "./Status";

export type Event = {
    state: Status;
    old_state: Status;
    timestamp: number;
    value?: number;
    values?: {
        [metric: string]: number;
    };
    metric: string;
    msg?: string;
    trigger_id: string;
    trigger_event?: boolean;
};

export type EventList = {
    total: number;
    list: Array<Event>;
    page: number;
    size: number;
};
