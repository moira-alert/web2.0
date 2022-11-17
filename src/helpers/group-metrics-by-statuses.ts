import { Metric, MetricItemList } from "../Domain/Metric";
import { Status } from "../Domain/Status";

export type MetricByStatuses = {
    [key in Status]?: { [key: string]: Metric };
};

// ToDo подумать, почему метрики группируются в listItem, а не в контейнере
export const groupMetricsByStatuses = (metrics: MetricItemList): MetricByStatuses =>
    Object.entries(metrics).reduce((acc: MetricByStatuses, [metricName, metric]) => {
        const { state } = metric;
        const metricsGroupByStatus = acc[state] || {};

        metricsGroupByStatus[metricName] = metric;
        acc[state] = metricsGroupByStatus;
        return acc;
    }, {});
