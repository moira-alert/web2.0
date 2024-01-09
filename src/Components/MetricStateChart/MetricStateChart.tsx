import React from "react";
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
import { Metric } from "../../Domain/Metric";

export type MetricNameToStateMap = Record<string, Metric>;

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

export function MetricStateChart({
    metrics,
    width,
    height,
    displayLegend = false,
    enableTooltip = false,
}: {
    metrics: MetricNameToStateMap;
    width: string;
    height: string;
    displayLegend?: boolean;
    enableTooltip?: boolean;
}) {
    const metricsStatusToCountMap = countMetricsByStatus(metrics);

    const data: ChartData<"doughnut"> = {
        labels: Array.from(metricsStatusToCountMap.keys()),
        datasets: [
            {
                data: Array.from(metricsStatusToCountMap.values()),
                borderWidth: 0,
                backgroundColor: Array.from(metricsStatusToCountMap.keys()).map((status) =>
                    getStatusColor(status)
                ),
            },
        ],
    };

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

                        return (
                            labels
                                ?.map((label, index) => {
                                    const value = data[index];
                                    const metricAmount = Number(value);
                                    const fillStyle = Array.isArray(backgroundColor)
                                        ? backgroundColor[index]
                                        : backgroundColor;
                                    return {
                                        text: `${label}: ${value}`,
                                        fillStyle,
                                        lineWidth: 0,
                                        metricAmount,
                                    };
                                })
                                .filter((item) => item.metricAmount !== 0)
                                .sort((a, b) => b.metricAmount - a.metricAmount) ?? []
                        );
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
}
