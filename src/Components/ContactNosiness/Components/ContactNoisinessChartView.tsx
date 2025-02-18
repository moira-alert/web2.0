import React from "react";
import { useTheme } from "../../../Themes";
import { createHtmlLegendPlugin } from "../../ContactEventStats/Components/htmlLegendPlugin";
import { NoisinessDataset } from "../../TriggerNoisiness/TiggerNoisinessChart";
import { Bar } from "react-chartjs-2";
import { triggerEventsChartOptions } from "../../../helpers/getChartOptions";
import { ChartOptions } from "chart.js";
import EditIcon from "@skbkontur/react-icons/Edit";

export const ContactNoisinessChartView: React.FC<{
    datasets: NoisinessDataset[];
    onEditClick: (label: string) => void;
}> = ({ datasets, onEditClick }) => {
    const theme = useTheme();

    const htmlLegendPlugin = createHtmlLegendPlugin(true, null, EditIcon, onEditClick);

    const data = {
        labels: [""],
        datasets,
    };

    return (
        <>
            <div id="trigger-events-legend-container" />
            <Bar
                data={data}
                plugins={[htmlLegendPlugin]}
                options={
                    triggerEventsChartOptions(
                        "Contacts",
                        "Number of Events",
                        theme.chartGridLinesColor
                    ) as ChartOptions<"bar">
                }
                style={{ maxHeight: "305px" }}
            />
        </>
    );
};
