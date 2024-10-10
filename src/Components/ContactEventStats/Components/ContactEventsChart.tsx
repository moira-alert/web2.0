import React, { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, ChartOptions, registerables } from "chart.js";
import {
    EContactEventsInterval,
    groupEventsByInterval,
    IContactEvent,
} from "../../../Domain/Contact";
import { getStatusColor, Status } from "../../../Domain/Status";
import { createHtmlLegendPlugin } from "./htmlLegendPlugin";
import { Select } from "@skbkontur/react-ui/components/Select";
import zoomPlugin from "chartjs-plugin-zoom";
import { getContactEventsChartOptions } from "../../../helpers/getChartOptions";
import { Flexbox } from "../../Flexbox/FlexBox";

ChartJS.register(...registerables);

interface IContactEventsBarChartProps {
    events: IContactEvent[];
}

export const ContactEventsChart: React.FC<IContactEventsBarChartProps> = ({ events }) => {
    const [interval, setInterval] = useState<EContactEventsInterval>(EContactEventsInterval.hour);

    const groupedTransitions = useMemo(() => groupEventsByInterval(events, interval), [
        events,
        interval,
    ]);

    const labels = useMemo(() => Object.keys(groupedTransitions), [events, interval]);

    const transitionTypes = useMemo(() => {
        const types = new Set<string>();
        Object.values(groupedTransitions).forEach((transitions) =>
            Object.keys(transitions).forEach((transition) => types.add(transition))
        );
        return types;
    }, [events, interval]);

    const datasets = useMemo(() => {
        return Array.from(transitionTypes).map((transition) => ({
            label: transition,
            data: labels.map((timestamp) => groupedTransitions[timestamp][transition]),
            backgroundColor: getStatusColor(transition.split(" to ")[1] as Status),
        }));
    }, [events, interval]);

    return (
        <Flexbox gap={10}>
            <Flexbox direction="row" justify="space-between" align="baseline">
                <span style={{ fontSize: "18px" }}>Trigger transitions</span>
                <span>
                    <label>Select Interval </label>
                    <Select
                        value={interval}
                        onValueChange={setInterval}
                        items={Object.values(EContactEventsInterval)}
                    />
                </span>
            </Flexbox>
            <div id="contact-events-legend-container" />
            <Bar
                plugins={[createHtmlLegendPlugin(false), zoomPlugin]}
                data={{ labels, datasets }}
                options={getContactEventsChartOptions(interval) as ChartOptions<"bar">}
            />
        </Flexbox>
    );
};
