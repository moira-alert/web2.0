import { MetricItemList } from "../Domain/Metric";
import { Status } from "../Domain/Status";
import { groupMetricsByStatuses, IMetricByStatuses } from "./group-metrics-by-statuses";

interface ITest {
    title: string;
    input: MetricItemList;
    output: IMetricByStatuses;
}

const tests: Array<ITest> = [
    {
        title: "Empty metric list",
        input: {},
        output: {},
    },
    {
        title: "Few metrics with one state",
        input: {
            "metric.state.del-1": {
                state: Status.DEL,
                timestamp: 1551098595,
            },
            "metric.state.del-2": {
                state: Status.DEL,
                timestamp: 1551098595,
            },
            "metric.state.del-3": {
                state: Status.DEL,
                timestamp: 1551098595,
            },
        },
        output: {
            DEL: {
                "metric.state.del-1": {
                    state: Status.DEL,
                    timestamp: 1551098595,
                },
                "metric.state.del-2": {
                    state: Status.DEL,
                    timestamp: 1551098595,
                },
                "metric.state.del-3": {
                    state: Status.DEL,
                    timestamp: 1551098595,
                },
            },
        },
    },
    {
        title: "Metric list with all states",
        input: {
            "metric.state.del": {
                state: Status.DEL,
                timestamp: 1551098595,
            },
            "metric.state.exception": {
                state: Status.EXCEPTION,
                timestamp: 1551098595,
            },
            "metric.state.nodata": {
                state: Status.NODATA,
                timestamp: 1551098595,
            },
            "metric.state.error": {
                state: Status.ERROR,
                timestamp: 1551098595,
            },
            "metric.state.warn": {
                state: Status.WARN,
                timestamp: 1551098595,
            },
            "metric.state.ok": {
                state: Status.OK,
                timestamp: 1551098595,
            },
        },
        output: {
            DEL: {
                "metric.state.del": {
                    state: Status.DEL,
                    timestamp: 1551098595,
                },
            },
            EXCEPTION: {
                "metric.state.exception": {
                    state: Status.EXCEPTION,
                    timestamp: 1551098595,
                },
            },
            NODATA: {
                "metric.state.nodata": {
                    state: Status.NODATA,
                    timestamp: 1551098595,
                },
            },
            ERROR: {
                "metric.state.error": {
                    state: Status.ERROR,
                    timestamp: 1551098595,
                },
            },
            WARN: {
                "metric.state.warn": {
                    state: Status.WARN,
                    timestamp: 1551098595,
                },
            },
            OK: {
                "metric.state.ok": {
                    state: Status.OK,
                    timestamp: 1551098595,
                },
            },
        },
    },
];

tests.forEach(({ title, input, output }) => {
    test(title, () => {
        expect(groupMetricsByStatuses(input)).toMatchObject(output);
    });
});
