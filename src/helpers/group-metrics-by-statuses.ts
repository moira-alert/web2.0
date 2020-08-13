import { Metric, MetricList } from "../Domain/Metric";

export interface IOutput {
    DEL?: { [key: string]: Metric };
    EXCEPTION?: { [key: string]: Metric };
    NODATA?: { [key: string]: Metric };
    ERROR?: { [key: string]: Metric };
    WARN?: { [key: string]: Metric };
    OK?: { [key: string]: Metric };
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
