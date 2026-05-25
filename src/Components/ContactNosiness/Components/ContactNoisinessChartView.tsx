import type { FC } from "react";
import { useMemo } from "react";
import { createHtmlLegendPlugin } from "../../ContactEventStats/Components/htmlLegendPlugin";
import { NoisinessDataset } from "../../TriggerNoisiness/TiggerNoisinessChart";
import { Bar } from "react-chartjs-2";
import { TriggerEventsChartOptions } from "../../../helpers/getChartOptions";
import { Chart as ChartJS, ChartOptions, registerables } from "chart.js";
import { IconToolPencilLineRegular16 } from "@skbkontur/icons/IconToolPencilLineRegular16";

ChartJS.register(...registerables);

export const ContactNoisinessChartView: FC<{
    datasets: NoisinessDataset[];
    onEditClick: (label: string) => void;
}> = ({ datasets, onEditClick }) => {
    const htmlLegendPlugin = useMemo(
        () =>
            createHtmlLegendPlugin((lable) => (
                <IconToolPencilLineRegular16
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
