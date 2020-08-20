import { MetricList } from "../Domain/Metric";
import groupMetricsByStatuses, { IMetricByStatuses } from "./group-metrics-by-statuses";

interface ITest {
    title: string;
    input: MetricList;
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
                state: "DEL",
                timestamp: 1551098595,
            },
            "metric.state.del-2": {
                state: "DEL",
                timestamp: 1551098595,
            },
            "metric.state.del-3": {
                state: "DEL",
                timestamp: 1551098595,
            },
        },
        output: {
            DEL: {
                "metric.state.del-1": {
                    state: "DEL",
                    timestamp: 1551098595,
                },
                "metric.state.del-2": {
                    state: "DEL",
                    timestamp: 1551098595,
                },
                "metric.state.del-3": {
                    state: "DEL",
                    timestamp: 1551098595,
                },
            },
        },
    },
    {
        title: "Metric list with all states",
        input: {
            "metric.state.del": {
                state: "DEL",
                timestamp: 1551098595,
            },
            "metric.state.exception": {
                state: "EXCEPTION",
                timestamp: 1551098595,
            },
            "metric.state.nodata": {
                state: "NODATA",
                timestamp: 1551098595,
            },
            "metric.state.error": {
                state: "ERROR",
                timestamp: 1551098595,
            },
            "metric.state.warn": {
                state: "WARN",
                timestamp: 1551098595,
            },
            "metric.state.ok": {
                state: "OK",
                timestamp: 1551098595,
            },
        },
        output: {
            DEL: {
                "metric.state.del": {
                    state: "DEL",
                    timestamp: 1551098595,
                },
            },
            EXCEPTION: {
                "metric.state.exception": {
                    state: "EXCEPTION",
                    timestamp: 1551098595,
                },
            },
            NODATA: {
                "metric.state.nodata": {
                    state: "NODATA",
                    timestamp: 1551098595,
                },
            },
            ERROR: {
                "metric.state.error": {
                    state: "ERROR",
                    timestamp: 1551098595,
                },
            },
            WARN: {
                "metric.state.warn": {
                    state: "WARN",
                    timestamp: 1551098595,
                },
            },
            OK: {
                "metric.state.ok": {
                    state: "OK",
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
