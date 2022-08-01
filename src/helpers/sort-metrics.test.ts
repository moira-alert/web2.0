import { keys } from "lodash";
import { sortMetrics } from "./sort-metrics";
import type { MetricItemList } from "../Domain/Metric";
import { Status } from "../Domain/Status";
import type { SortingColumn } from "../Components/MetricList/MetricList";

const metrics: MetricItemList = {
    "vm-elk-f1": {
        state: Status.OK,
        timestamp: 1504516241,
        event_timestamp: 1503992518,
        suppressed: false,
        values: {
            t1: 82.5,
            t2: 20.23,
        },
        maintenance: 1555804800,
        maintenance_info: {
            setup_user: "Superman",
            setup_time: 1553158221,
        },
    },
    "vm-elk-l1": {
        state: Status.OK,
        timestamp: 1504516241,
        event_timestamp: 1503992686,
        suppressed: false,
        values: {
            t1: 96.54,
            t2: 19.87,
        },
        maintenance_info: {
            setup_user: null,
            setup_time: null,
        },
    },
    "vm-elk-r1": {
        state: Status.OK,
        timestamp: 1504516241,
        event_timestamp: 1503992698,
        suppressed: false,
        values: {
            t1: 93.22,
            t2: 20.77,
        },
        maintenance_info: {
            setup_user: null,
            setup_time: null,
        },
    },
    "vm-elk-r2": {
        state: Status.OK,
        timestamp: 1504516241,
        event_timestamp: 1503992299,
        suppressed: false,
        values: {
            t1: 89.54,
            t2: 18.45,
        },
        maintenance_info: {
            setup_user: null,
            setup_time: null,
        },
    },
    "vm-elk-s1": {
        state: Status.WARN,
        timestamp: 1504516241,
        event_timestamp: 1504407083,
        suppressed: false,
        values: {
            t1: 180095,
            t2: 19.39,
        },
        maintenance_info: {
            setup_user: null,
            setup_time: null,
        },
    },
    "vm-elk-s2": {
        state: Status.WARN,
        timestamp: 1504516241,
        event_timestamp: 1504390505,
        suppressed: false,
        values: {
            t1: 19.83,
        },
        maintenance_info: {
            setup_user: null,
            setup_time: null,
        },
    },
    "vm-elk-s3": {
        state: Status.OK,
        timestamp: 1504516241,
        event_timestamp: 1503992825,
        suppressed: false,
        values: {
            t1: 180095,
            t2: 20.52,
        },
        maintenance_info: {
            setup_user: null,
            setup_time: null,
        },
    },
    "vm-elk-s4": {
        state: Status.NODATA,
        timestamp: 1504516241,
        event_timestamp: 1503999000,
        suppressed: false,
        maintenance_info: {
            setup_user: null,
            setup_time: null,
        },
    },
};

const cases: { column: SortingColumn; expected: string[] }[] = [
    {
        column: "state",
        expected: [
            "vm-elk-s3",
            "vm-elk-r2",
            "vm-elk-r1",
            "vm-elk-l1",
            "vm-elk-f1",
            "vm-elk-s2",
            "vm-elk-s1",
            "vm-elk-s4",
        ],
    },
    {
        column: "name",
        expected: [
            "vm-elk-f1",
            "vm-elk-l1",
            "vm-elk-r1",
            "vm-elk-r2",
            "vm-elk-s1",
            "vm-elk-s2",
            "vm-elk-s3",
            "vm-elk-s4",
        ],
    },
    {
        column: "event",
        expected: [
            "vm-elk-r2",
            "vm-elk-f1",
            "vm-elk-l1",
            "vm-elk-r1",
            "vm-elk-s3",
            "vm-elk-s4",
            "vm-elk-s2",
            "vm-elk-s1",
        ],
    },
    {
        column: "value",
        expected: [
            "vm-elk-s4",
            "vm-elk-s2",
            "vm-elk-f1",
            "vm-elk-r2",
            "vm-elk-r1",
            "vm-elk-l1",
            "vm-elk-s1",
            "vm-elk-s3",
        ],
    },
];

describe("sortMetrics", () => {
    test.each(cases)("sorts metrics by $column in ascending order", ({ column, expected }) => {
        const sorted = sortMetrics(metrics, column, true);
        expect(keys(sorted)).toEqual(expected);
    });

    test.each(cases)("sorts metrics by $column in descending order", ({ column, expected }) => {
        const reverseSorted = sortMetrics(metrics, column, false);
        expect(keys(reverseSorted)).toEqual(expected.reverse());
    });
});
