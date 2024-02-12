import React from "react";
import data from "../Stories/Data/Triggers";
import { MetricStateChart } from "../Components/MetricStateChart/MetricStateChart";

export default {
    title: "MetricStateChart",
};

export const Default = () => (
    <MetricStateChart
        displayLegend
        enableTooltip
        height={"10rem"}
        width={"18rem"}
        metrics={data[0].last_check?.metrics ?? {}}
    />
);
