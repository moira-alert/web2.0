import React, { useMemo } from "react";
import { TriggerNoisiness } from "../../../Domain/Trigger";
import { useTheme } from "../../../Themes";
import { createHtmlLegendPlugin } from "../../ContactEventStats/Components/htmlLegendPlugin";
import { NoisinessDataset } from "../TiggerNoisinessChart";
import { Bar } from "react-chartjs-2";
import { triggerEventsChartOptions } from "../../../helpers/getChartOptions";
import { ChartOptions } from "chart.js";

export const TriggerNoisinessChartView: React.FC<{
    datasets: NoisinessDataset[];
    triggers?: TriggerNoisiness;
}> = ({ datasets, triggers }) => {
    const theme = useTheme();

    const htmlLegendPlugin = useMemo(() => {
        const getLink = (triggerName: string) => {
            const trigger = triggers?.list.find((t) => t.name === triggerName);
            return `/trigger/${trigger?.id}`;
        };
        return createHtmlLegendPlugin(true, getLink);
    }, [triggers]);

    const data = {
        labels: [""],
        datasets,
    };

    return (
        <Bar
            data={data}
            plugins={[htmlLegendPlugin]}
            options={
                triggerEventsChartOptions(
                    "Triggers",
                    "Number of Events",
                    theme.chartGridLinesColor
                ) as ChartOptions<"bar">
            }
            style={{ maxHeight: "305px" }}
        />
    );
};
