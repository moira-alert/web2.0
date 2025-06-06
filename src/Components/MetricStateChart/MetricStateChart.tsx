import React, { FC, useMemo } from "react";
import {
    ArcElement,
    Chart,
    Chart as ChartJS,
    ChartData,
    ChartOptions,
    Legend,
    LegendItem,
    Tooltip,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Status, getStatusColor } from "../../Domain/Status";
import { isMuted, Metric } from "../../Domain/Metric";
import { useTheme } from "../../Themes";

export type MetricNameToStateMap = Record<string, Metric>;

export interface IProps {
    metrics: MetricNameToStateMap;
    width?: string;
    height?: string;
    displayLegend?: boolean;
    enableTooltip?: boolean;
}

export const countMetricsByStatus = (metrics: MetricNameToStateMap) =>
    Object.values(metrics).reduce(
        (acc, item) => {
            const currentCount = acc.get(item.state) ?? 0;
            acc.set(item.state, currentCount + 1);
            return acc;
        },
        new Map([
            [Status.ERROR, 0],
            [Status.NODATA, 0],
            [Status.OK, 0],
            [Status.WARN, 0],
        ]) as Map<Status, number>
    );

ChartJS.register(ArcElement, Tooltip, Legend);

const splitByMuted = (metrics: MetricNameToStateMap) => {
    const mutedMetrics: MetricNameToStateMap = {};
    const activeMetrics: MetricNameToStateMap = {};

    for (const [key, metric] of Object.entries(metrics)) {
        if (isMuted(metric)) {
            mutedMetrics[key] = metric;
        } else {
            activeMetrics[key] = metric;
        }
    }

    return { mutedMetrics, activeMetrics };
};

export const MetricStateChart: FC<IProps> = ({
    metrics,
    width,
    height,
    displayLegend = false,
    enableTooltip = false,
}) => {
    const theme = useTheme();

    const { mutedMetrics, activeMetrics } = useMemo(() => splitByMuted(metrics), [metrics]);
    const mutedMetricsCount = Object.keys(mutedMetrics).length;

    const metricsStatusToCountMap = countMetricsByStatus(activeMetrics);

    const data: ChartData<"doughnut"> = {
        labels: Array.from(metricsStatusToCountMap.keys()),
        datasets: [
            {
                data: Array.from(metricsStatusToCountMap.values()),
                borderWidth: 0,
                backgroundColor: Array.from(metricsStatusToCountMap.keys()).map(getStatusColor),
            },
        ],
    };

    const defaultLabelStyles = { fontColor: theme.textColorDefault, lineWidth: 0 };

    const options = {
        maintainAspectRatio: false,
        animation: false,
        plugins: {
            legend: {
                display: displayLegend,
                position: "right",
                labels: {
                    generateLabels(chart: Chart): LegendItem[] {
                        const { labels, datasets } = chart.data;
                        const { data, backgroundColor } = datasets[0];

                        const chartLabels =
                            labels?.map((label, index) => {
                                const value = data[index];
                                const metricAmount = Number(value);
                                const fillStyle = Array.isArray(backgroundColor)
                                    ? backgroundColor[index]
                                    : backgroundColor;
                                return {
                                    text: `${label}: ${value}`,
                                    fillStyle,
                                    metricAmount,
                                    ...defaultLabelStyles,
                                };
                            }) ?? [];

                        if (mutedMetricsCount > 0) {
                            chartLabels.push({
                                text: `MUTED: ${mutedMetricsCount}`,
                                fillStyle: "transparent",
                                metricAmount: mutedMetricsCount,
                                ...defaultLabelStyles,
                            });
                        }

                        return chartLabels
                            .filter((item) => item.metricAmount !== 0)
                            .sort((a, b) => b.metricAmount - a.metricAmount);
                    },
                },
            },
            tooltip: { enabled: enableTooltip },
        },
    };

    return (
        <div style={{ width, height }}>
            <Doughnut
                width={20}
                height={5}
                data={data}
                options={options as ChartOptions<"doughnut">}
            />
        </div>
    );
};
