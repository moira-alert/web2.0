import React, { useMemo } from "react";
import { TriggerNoisiness } from "../../../Domain/Trigger";
import { useTheme } from "../../../Themes";
import { createHtmlLegendPlugin } from "../../ContactEventStats/Components/htmlLegendPlugin";
import { NoisinessDataset } from "../TiggerNoisinessChart";
import { Bar } from "react-chartjs-2";
import { TriggerEventsChartOptions } from "../../../helpers/getChartOptions";
import { ChartOptions } from "chart.js";
import { Link } from "@skbkontur/react-ui/components/Link";
import LinkIcon from "@skbkontur/react-icons/Link";

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
        return createHtmlLegendPlugin((label) => (
            <>
                <Link
                    href={getLink(label)}
                    target="_blank"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                    icon={<LinkIcon />}
                />
            </>
        ));
    }, [triggers, theme]);

    const data = {
        labels: [""],
        datasets,
    };

    return (
        <Bar
            data={data}
            plugins={[htmlLegendPlugin]}
            options={
                TriggerEventsChartOptions("Triggers", "Number of Events") as ChartOptions<"bar">
            }
            style={{ maxHeight: "305px" }}
        />
    );
};
