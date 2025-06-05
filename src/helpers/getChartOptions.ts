import { EContactEventsInterval } from "../Domain/Contact";
import { useTheme } from "../Themes";

export const ContactEventsChartOptions = (interval: EContactEventsInterval) => {
    const theme = useTheme();

    return {
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
                grid: { color: theme.chartGridLinesColor },
                type: "timeseries",
                time: {
                    tooltipFormat:
                        interval === EContactEventsInterval.day
                            ? "dd MMM yyyy"
                            : "dd MMM yyyy HH:mm",
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
                    color: theme.chartTextItemsColor,
                },
            },
            y: {
                grid: { color: theme.chartGridLinesColor },
                min: 0,
                ticks: {
                    beginAtZero: true,
                    color: theme.chartTextItemsColor,
                },
                title: {
                    display: true,
                    text: "Number of Transitions",
                    color: theme.chartTextItemsColor,
                },
            },
        },
    };
};

export const TriggerEventsChartOptions = (verticalAxisText: string, horizontalAxisText: string) => {
    const theme = useTheme();

    return {
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
                ticks: {
                    color: theme.chartTextItemsColor,
                },
                grid: { color: theme.chartGridLinesColor },
                title: {
                    display: true,
                    text: horizontalAxisText,
                    color: theme.chartTextItemsColor,
                },
            },
            y: {
                ticks: {
                    color: theme.chartTextItemsColor,
                },
                grid: { color: theme.chartGridLinesColor },
                title: {
                    display: true,
                    text: verticalAxisText,
                    color: theme.chartTextItemsColor,
                },
            },
        },
    };
};
