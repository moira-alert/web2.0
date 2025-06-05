import "chartjs-adapter-date-fns";
import React, { useMemo } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, ChartOptions, registerables } from "chart.js";
import { IContactEvent } from "../../../Domain/Contact";
import { getColor } from "../../Tag/Tag";
import { createHtmlLegendPlugin } from "./htmlLegendPlugin";
import { TriggerEventsChartOptions } from "../../../helpers/getChartOptions";
import { Flexbox } from "../../Flexbox/FlexBox";
import { Link } from "@skbkontur/react-ui/components/Link";
import LinkIcon from "@skbkontur/react-icons/Link";

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

    const renderLegendItemAddon = (label: string) => (
        <Link
            href={`/trigger/${label}`}
            target="_blank"
            onClick={(e) => e.stopPropagation()}
            icon={<LinkIcon />}
        />
    );

    const htmlLegendPlugin = useMemo(() => createHtmlLegendPlugin(renderLegendItemAddon), [
        renderLegendItemAddon,
    ]);

    return (
        <Flexbox gap={10}>
            <span style={{ fontSize: "18px", display: "inline-block" }}>Grouped by trigger</span>
            <div id="trigger-events-legend-container" />
            <Bar
                data={data}
                plugins={[htmlLegendPlugin]}
                options={
                    TriggerEventsChartOptions("Triggers", "Number of Events") as ChartOptions<"bar">
                }
            />
        </Flexbox>
    );
};
