import { Metric, MetricList } from "../Domain/Metric";

// ToDo подумать, почему метрики группируются в listItem, а не в контейнере
function groupMetricsByStatuses(metrics: MetricList): Record<string, Record<string, Metric>> {
    const result: Record<string, Record<string, Metric>> = {};

    Object.keys(metrics).forEach(metricName => {
        const metric = metrics[metricName];

        if (!result[metric.state]) {
            result[metric.state] = {};
        }

        result[metric.state][metricName] = metric;
    });

    return result;
}

export { groupMetricsByStatuses as default };
