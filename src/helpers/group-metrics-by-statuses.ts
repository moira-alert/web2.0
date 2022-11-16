import { Metric, MetricItemList } from "../Domain/Metric";

export interface IMetricByStatuses {
    DEL?: { [key: string]: Metric };
    EXCEPTION?: { [key: string]: Metric };
    NODATA?: { [key: string]: Metric };
    ERROR?: { [key: string]: Metric };
    WARN?: { [key: string]: Metric };
    OK?: { [key: string]: Metric };
}

// ToDo подумать, почему метрики группируются в listItem, а не в контейнере
function groupMetricsByStatuses(metrics: MetricItemList): IMetricByStatuses {
    const result = Object.keys(metrics).reduce((acc: IMetricByStatuses, metricName) => {
        const metric = metrics[metricName];
        const { state } = metric;

        if (!acc[state]) {
            acc[state] = {};
        }

        // @ts-ignore testing if this will improve render time in staging
        acc[state][metricName] = metric;
        return acc;
    }, {});
    return result;
}

export { groupMetricsByStatuses as default };
