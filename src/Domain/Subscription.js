// @flow

import type { Schedule } from "./Schedule";

export type Subscription = {
    sched: Schedule,
    tags: Array<string>,
    throttling: boolean,
    contacts: Array<string>,
    enabled: boolean,
    user: string,
    id: string,
    ignore_recoverings: boolean,
    ignore_warnings: boolean,
};
