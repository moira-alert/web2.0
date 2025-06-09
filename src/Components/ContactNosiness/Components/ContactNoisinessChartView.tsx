import React, { useMemo } from "react";
import { createHtmlLegendPlugin } from "../../ContactEventStats/Components/htmlLegendPlugin";
import { NoisinessDataset } from "../../TriggerNoisiness/TiggerNoisinessChart";
import { Bar } from "react-chartjs-2";
import { TriggerEventsChartOptions } from "../../../helpers/getChartOptions";
import { ChartOptions } from "chart.js";
import EditIcon from "@skbkontur/react-icons/Edit";

export const ContactNoisinessChartView: React.FC<{
    datasets: NoisinessDataset[];
    onEditClick: (label: string) => void;
}> = ({ datasets, onEditClick }) => {
    const htmlLegendPlugin = useMemo(
        () =>
            createHtmlLegendPlugin((lable) => (
                <EditIcon
                    onClick={(e) => {
                        e.stopPropagation();
                        onEditClick(lable);
                    }}
                />
            )),
        []
    );

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
                    TriggerEventsChartOptions("Contacts", "Number of Events") as ChartOptions<"bar">
                }
                style={{ maxHeight: "305px" }}
            />
        </>
    );
};
