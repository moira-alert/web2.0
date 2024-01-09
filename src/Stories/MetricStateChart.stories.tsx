import React from "react";
import { storiesOf } from "@storybook/react";
import data from "../Stories/Data/Triggers";
import { MetricStateChart } from "../Components/MetricStateChart/MetricStateChart";

storiesOf("MetricStateChart", module).add("Default", () => (
    <MetricStateChart
        displayLegend
        enableTooltip
        height={"10rem"}
        width={"18rem"}
        metrics={data[0].last_check?.metrics ?? {}}
    />
));
