import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, ChartOptions, registerables } from "chart.js";
import { EContactEventsInterval, IContactEvent } from "../../../Domain/Contact";
import { format, fromUnixTime, startOfMinute, startOfHour, startOfDay } from "date-fns";
import { getStatusColor, Status } from "../../../Domain/Status";
import { createHtmlLegendPlugin } from "./htmlLegendPlugin";
import { Select } from "@skbkontur/react-ui/components/Select";
import zoomPlugin from "chartjs-plugin-zoom";

ChartJS.register(...registerables);

interface IContactEventsBarChartProps {
    events: IContactEvent[];
}

export const ContactEventsChart: React.FC<IContactEventsBarChartProps> = ({ events }) => {
    const [interval, setInterval] = useState<EContactEventsInterval>(EContactEventsInterval.hour);

    const groupEventsByInterval = (events: IContactEvent[], interval: EContactEventsInterval) => {
        return events.reduce((acc, event) => {
            let timestampFormatted;
            switch (interval) {
                case EContactEventsInterval.minute:
                    timestampFormatted = startOfMinute(fromUnixTime(event.timestamp));
                    break;
                case EContactEventsInterval.hour:
                    timestampFormatted = startOfHour(fromUnixTime(event.timestamp));
                    break;
                case EContactEventsInterval.day:
                    timestampFormatted = startOfDay(fromUnixTime(event.timestamp));
                    break;
            }

            const formattedTimestamp = format(timestampFormatted, "yyyy-MM-dd HH:mm");

            const transition = `${event.old_state} to ${event.state}`;

            if (!acc[formattedTimestamp]) {
                acc[formattedTimestamp] = {};
            }
            if (!acc[formattedTimestamp][transition]) {
                acc[formattedTimestamp][transition] = 0;
            }
            acc[formattedTimestamp][transition]++;
            return acc;
        }, {} as Record<string, Record<string, number>>);
    };

    const groupedTransitions = groupEventsByInterval(events, interval);
    const labels = Object.keys(groupedTransitions);
    const transitionTypes = new Set<string>();
    Object.values(groupedTransitions).forEach((transitions) =>
        Object.keys(transitions).forEach((transition) => transitionTypes.add(transition))
    );

    const datasets = Array.from(transitionTypes).map((transition) => ({
        label: transition,
        data: labels.map((timestamp) => groupedTransitions[timestamp][transition]),
        backgroundColor: getStatusColor(transition.split(" to ")[1] as Status),
    }));

    const data = {
        labels,
        datasets,
    };

    const options = {
        animation: false,
        maxBarThickness: 20,
        plugins: {
            legend: { display: false },
            htmlLegend: {
                containerID: "contact-events-legend-container",
            },
            zoom: {
                pan: {
                    enabled: true,
                    modifierKey: "ctrl",
                },
                zoom: {
                    drag: { enabled: true },
                    wheel: { enabled: true },
                    mode: "xy",
                },
            },
        },

        scales: {
            x: {
                type: "timeseries",
                time: {
                    tooltipFormat:
                        interval === EContactEventsInterval.day
                            ? "dd MMM yyyy"
                            : "dd MMM yyyy HH:mm",
                    displayFormats: {
                        hour: interval === EContactEventsInterval.day ? "dd MMM" : "HH:mm",
                    },
                },

                ticks: {
                    autoSkip: true,
                    maxRotation: 0,
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: "Number of Transitions",
                },
            },
        },
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                }}
            >
                <span style={{ fontSize: "18px" }}>Trigger transitions</span>
                <span>
                    <label>Select Interval </label>
                    <Select
                        value={interval}
                        onValueChange={setInterval}
                        items={Object.values(EContactEventsInterval)}
                    />
                </span>
            </div>
            <div id="contact-events-legend-container" />
            <Bar
                plugins={[createHtmlLegendPlugin(false), zoomPlugin]}
                data={data}
                options={options as ChartOptions<"bar">}
            />
        </div>
    );
};
