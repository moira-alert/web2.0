import type { ChartType, Plugin } from "chart.js";
declare module "chart.js" {
    interface PluginOptionsByType<TType extends ChartType = ChartType> {
        htmlLegend: {
            containerID: string;
        };
    }
}
