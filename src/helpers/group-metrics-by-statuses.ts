
import { Metric, MetricList } from "../Domain/Metric";
import { Status } from "../Domain/Status";

// ToDo подумать, почему метрики группируются в listItem, а не в контейнере
function groupMetricsByStatuses(metrics: MetricList) {
  const result = {};

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