import { Metric, MetricList } from "../Domain/Metric";

export interface IOutput {
    DEL?: Record<string, Metric>;
    EXCEPTION?: Record<string, Metric>;
    NODATA?: Record<string, Metric>;
    ERROR?: Record<string, Metric>;
    WARN?: Record<string, Metric>;
    OK?: Record<string, Metric>;
}

// ToDo подумать, почему метрики группируются в listItem, а не в контейнере
function groupMetricsByStatuses(metrics: MetricList): IOutput {
    const result: IOutput = {};

    Object.keys(metrics).forEach(metricName => {
        const metric = metrics[metricName];
        const { state } = metric;

        result[state] = {
            ...result[state],
            [metricName]: metric,
        };
    });

    return result;
}

export { groupMetricsByStatuses as default };
