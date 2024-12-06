import { EContactEventsInterval } from "../Domain/Contact";

export const getContactEventsChartOptions = (
    interval: EContactEventsInterval,
    gridLinesColor?: string
) => ({
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
            grid: { color: gridLinesColor },
            type: "timeseries",
            time: {
                tooltipFormat:
                    interval === EContactEventsInterval.day ? "dd MMM yyyy" : "dd MMM yyyy HH:mm",
                displayFormats: {
                    hour: "HH:mm",
                    day: "dd MMM",
                    minute: "HH:mm",
                },
                unit: interval,
                minUnit: "minute",
            },

            ticks: {
                autoSkip: true,
                maxRotation: 0,
            },
        },
        y: {
            grid: { color: gridLinesColor },
            min: 0,
            ticks: {
                beginAtZero: true,
            },
            title: {
                display: true,
                text: "Number of Transitions",
            },
        },
    },
});

export const triggerEventsChartOptions = (gridLinesColor?: string) => ({
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
            grid: { color: gridLinesColor },
            title: {
                display: true,
                text: "Number of Events",
            },
        },
        y: {
            grid: { color: gridLinesColor },
            title: {
                display: true,
                text: "Triggers",
            },
        },
    },
});
