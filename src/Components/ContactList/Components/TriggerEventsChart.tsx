import "chartjs-adapter-date-fns";
import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, ChartOptions, registerables } from "chart.js";
import { IContactEvent } from "../../../Domain/Contact";
import { getColor } from "../../Tag/Tag";
import { createHtmlLegendPlugin } from "./htmlLegendPlugin";

ChartJS.register(...registerables);

interface ITriggerEventsBarChartProps {
    events: IContactEvent[];
}

export const TriggerEventsChart: React.FC<ITriggerEventsBarChartProps> = ({ events }) => {
    const groupedEvents = events.reduce<Record<string, number>>((acc, event) => {
        acc[event.trigger_id] = (acc[event.trigger_id] || 0) + 1;
        return acc;
    }, {});

    const sortedEvents = Object.entries(groupedEvents).sort(([, a], [, b]) => b - a);

    const datasets = sortedEvents.map(([triggerId, count]) => ({
        label: triggerId,
        data: [count],
        backgroundColor: getColor(triggerId).backgroundColor,
    }));

    const data = {
        labels: [""],
        datasets,
    };

    const options = {
        animation: false,
        maxBarThickness: 20,
        plugins: {
            legend: { display: false },
            htmlLegend: {
                containerID: "trigger-events-legend-container",
            },
        },
        indexAxis: "y",
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Number of Events",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Triggers",
                },
            },
        },
    };

    return (
        <>
            <span style={{ fontSize: "18px", marginBottom: "10px", display: "inline-block" }}>
                Grouped by trigger
            </span>
            <div id="trigger-events-legend-container" />
            <Bar
                data={data}
                plugins={[createHtmlLegendPlugin(true)]}
                options={options as ChartOptions<"bar">}
            />
        </>
    );
};
