import React from "react";
import { Chart, LegendItem, Plugin } from "chart.js";
import ArrowUpIcon from "@skbkontur/react-icons/ArrowChevronUp";
import ArrowDownIcon from "@skbkontur/react-icons/ArrowChevronDown";
import classNames from "classnames/bind";
import { createRoot } from "react-dom/client";
import { useTheme } from "../../../Themes";
import { Providers } from "../../../Providers/Providers";

import styles from "./Legend.less";

const cn = classNames.bind(styles);

let lastClickedIndex: number | null | undefined = null;
let isExpanded = false;
const maxVisibleItems = 7;

interface LegendContainerWithRoot extends HTMLElement {
    _root?: ReturnType<typeof createRoot>;
}

const LegendItemComponent: React.FC<{
    item: LegendItem;
    index: number;
    chart: Chart;
    updateLegendStyles: () => void;
    renderLegendItemAddon?: (label: string) => React.ReactNode;
}> = ({ item, index, chart, updateLegendStyles, renderLegendItemAddon }) => {
    const theme = useTheme();
    if (!item.text || item.text.trim() === "") {
        return null;
    }
    const handleClick = () => {
        const isVisible = chart.isDatasetVisible(item.datasetIndex as number);
        if (lastClickedIndex === item.datasetIndex && isVisible) {
            chart.data.datasets.forEach((_, idx: number) => {
                chart.setDatasetVisibility(idx, true);
            });
            lastClickedIndex = null;
        } else {
            chart.data.datasets.forEach((_, idx: number) => {
                chart.setDatasetVisibility(idx, idx === item.datasetIndex);
            });
            lastClickedIndex = item.datasetIndex;
        }
        chart.update();
        updateLegendStyles();
    };

    return (
        <li
            id={`legend-item-${item.datasetIndex}`}
            className={cn("legend-item", {
                hidden: index >= maxVisibleItems && !isExpanded,
                active: lastClickedIndex === item.datasetIndex,
            })}
            onClick={handleClick}
        >
            <span
                className={cn("legend-box")}
                style={{
                    background: item.fillStyle as string,
                    borderColor: item.strokeStyle as string,
                    borderWidth: item.lineWidth + "px",
                }}
            />
            <span className={cn("legend-text")} style={{ color: theme.chartTextItemsColor }}>
                {item.text}
            </span>
            <span className={cn("legend-item-addon")}>
                {renderLegendItemAddon && renderLegendItemAddon(item.text)}
            </span>
        </li>
    );
};

const Legend: React.FC<{
    chart: Chart;
    items: LegendItem[];
    updateLegendStyles: () => void;
    renderLegendItemAddon?: (label: string) => React.ReactNode;
}> = ({ chart, items, updateLegendStyles, renderLegendItemAddon }) => {
    const IconComponent = isExpanded ? ArrowUpIcon : ArrowDownIcon;

    const toggleExpand = () => {
        isExpanded = !isExpanded;
        chart.update();
    };

    return (
        <ul className={cn("legend-list")}>
            {items.map((item, index) => (
                <LegendItemComponent
                    key={item.datasetIndex}
                    item={item}
                    index={index}
                    chart={chart}
                    updateLegendStyles={updateLegendStyles}
                    renderLegendItemAddon={renderLegendItemAddon}
                />
            ))}
            {items.length > maxVisibleItems && (
                <IconComponent className={cn("legend-toggle-icon")} onClick={toggleExpand} />
            )}
        </ul>
    );
};

export const createHtmlLegendPlugin = (
    renderLegendItemAddon?: (label: string) => React.ReactNode
): Plugin<"bar"> => ({
    id: "htmlLegend",
    afterUpdate(chart) {
        const containerID = chart.options.plugins?.htmlLegend?.containerID || "";
        const legendContainer = document.getElementById(containerID) as LegendContainerWithRoot;

        if (legendContainer) {
            const items = chart.options.plugins?.legend?.labels?.generateLabels?.(
                chart
            ) as LegendItem[];
            const updateLegendStyles = () => {
                const ul = legendContainer.querySelector("ul");
                if (ul) {
                    const legendItems = ul.querySelectorAll("li");
                    legendItems.forEach((legendItem) => {
                        if (
                            parseInt(legendItem.id.replace("legend-item-", "")) === lastClickedIndex
                        ) {
                            legendItem.classList.add(cn("active"));
                        } else {
                            legendItem.classList.remove(cn("active"));
                        }
                    });

                    if (lastClickedIndex === null) {
                        legendItems.forEach((legendItem) => {
                            legendItem.classList.remove(cn("active"));
                        });
                    }
                }
            };

            if (!legendContainer._root) {
                legendContainer._root = createRoot(legendContainer);
            }

            legendContainer._root.render(
                <Providers>
                    <Legend
                        chart={chart}
                        items={items}
                        updateLegendStyles={updateLegendStyles}
                        renderLegendItemAddon={renderLegendItemAddon}
                    />
                </Providers>
            );
        }
    },
});
