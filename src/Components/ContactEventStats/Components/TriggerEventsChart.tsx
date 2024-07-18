import "chartjs-adapter-date-fns";
import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, ChartOptions, registerables } from "chart.js";
import { IContactEvent } from "../../../Domain/Contact";
import { getColor } from "../../Tag/Tag";
import { createHtmlLegendPlugin } from "./htmlLegendPlugin";
import { triggerEventsChartOptions } from "../../../helpers/getChartOptions";

ChartJS.register(...registerables);

interface ITriggerEventsBarChartProps {
    events: IContactEvent[];
}

export const TriggerEventsChart: React.FC<ITriggerEventsBarChartProps> = ({ events }) => {
    const groupedEvents = useMemo(
        () =>
            events.reduce<Record<string, number>>((acc, event) => {
                acc[event.trigger_id] = (acc[event.trigger_id] || 0) + 1;
                return acc;
            }, {}),
        [events]
    );

    const sortedEvents = useMemo(() => {
        return Object.entries(groupedEvents).sort(([, a], [, b]) => b - a);
    }, [events]);

    const datasets = sortedEvents.map(([triggerId, count]) => ({
        label: triggerId,
        data: [count],
        backgroundColor: getColor(triggerId).backgroundColor,
    }));

    const data = {
        labels: [""],
        datasets,
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
                options={triggerEventsChartOptions as ChartOptions<"bar">}
            />
        </>
    );
};
