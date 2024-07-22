import { EContactEventsInterval } from "../Domain/Contact";

export const getContactEventsChartOptions = (interval: EContactEventsInterval) => ({
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

export const triggerEventsChartOptions = {
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
