import "chartjs-adapter-date-fns";
import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, ChartOptions, registerables } from "chart.js";
import { IContactEvent } from "../../../Domain/Contact";
import { getColor } from "../../Tag/Tag";
import { createHtmlLegendPlugin } from "./htmlLegendPlugin";
import { triggerEventsChartOptions } from "../../../helpers/getChartOptions";
import { Flexbox } from "../../Flexbox/FlexBox";
import { useTheme } from "../../../Themes";

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

    const theme = useTheme();

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
        <Flexbox gap={10}>
            <span style={{ fontSize: "18px", display: "inline-block" }}>Grouped by trigger</span>
            <div id="trigger-events-legend-container" />
            <Bar
                data={data}
                plugins={[createHtmlLegendPlugin(true, (triggerId) => `/trigger/${triggerId}`)]}
                options={
                    triggerEventsChartOptions(
                        "Triggers",
                        "Number of Events",
                        theme.chartGridLinesColor
                    ) as ChartOptions<"bar">
                }
            />
        </Flexbox>
    );
};
