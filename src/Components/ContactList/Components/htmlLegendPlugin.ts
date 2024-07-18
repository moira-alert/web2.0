import { LegendItem, Plugin } from "chart.js";
import LinkIcon from "../../../Assets/link-icon.svg";
import ArrowDownIcon from "../../../Assets/arrow-down-icon.svg";
import ArrowUpIcon from "../../../Assets/arrow-up-icon.svg";

let lastClickedIndex: number | null = null;
let isExpanded = false;
const maxVisibleItems = 7;

export const getOrCreateLegendList = (id: string): HTMLUListElement => {
    const legendContainer = document.getElementById(id);
    let listContainer = legendContainer?.querySelector("ul") as HTMLUListElement | null;

    if (!listContainer) {
        listContainer = document.createElement("ul");
        listContainer.style.display = "flex";
        listContainer.style.gap = "5px";
        listContainer.style.justifyContent = "center";
        listContainer.style.flexWrap = "wrap";
        listContainer.style.margin = "0";
        listContainer.style.padding = "0";
        listContainer.style.maxWidth = "100%";

        legendContainer?.appendChild(listContainer);
    }

    return listContainer;
};

const updateLegendStyles = (ul: HTMLUListElement) => {
    const legendItems = ul.querySelectorAll("li");
    legendItems.forEach((legendItem) => {
        if (parseInt(legendItem.id.replace("legend-item-", "")) === lastClickedIndex) {
            legendItem.style.opacity = "1";
            legendItem.style.fontWeight = "bold";
        } else {
            legendItem.style.opacity = "0.5";
            legendItem.style.fontWeight = "normal";
        }
    });

    if (lastClickedIndex === null) {
        legendItems.forEach((legendItem) => {
            legendItem.style.opacity = "1";
            legendItem.style.fontWeight = "normal";
        });
    }
};

export const createHtmlLegendPlugin = (showLinks: boolean): Plugin<"bar"> => ({
    id: "htmlLegend",
    afterUpdate(chart) {
        const ul = getOrCreateLegendList(chart.options.plugins?.htmlLegend?.containerID || "");
        while (ul.firstChild) {
            ul.firstChild.remove();
        }

        const items = chart.options.plugins?.legend?.labels?.generateLabels?.(
            chart
        ) as LegendItem[];

        if (items) {
            items.forEach((item, index) => {
                const li = document.createElement("li");
                li.style.alignItems = "center";
                li.style.cursor = "pointer";
                li.style.display = index < maxVisibleItems || isExpanded ? "flex" : "none";
                li.style.marginLeft = "10px";
                li.style.whiteSpace = "nowrap";
                li.id = `legend-item-${item.datasetIndex}`;

                li.onclick = () => {
                    if (typeof item.datasetIndex !== "undefined") {
                        const isVisible = chart.isDatasetVisible(item.datasetIndex);

                        if (lastClickedIndex === item.datasetIndex && isVisible) {
                            // If current element is already visible, show all
                            chart.data.datasets.forEach((_, idx) => {
                                chart.setDatasetVisibility(idx, true);
                            });
                            lastClickedIndex = null;
                        } else {
                            // Show current only
                            chart.data.datasets.forEach((_, idx) => {
                                chart.setDatasetVisibility(idx, idx === item.datasetIndex);
                            });
                            lastClickedIndex = item.datasetIndex;
                        }

                        chart.update();
                        updateLegendStyles(ul);
                    }
                };

                const boxSpan = document.createElement("span");
                boxSpan.style.background = item.fillStyle as string;
                boxSpan.style.borderColor = item.strokeStyle as string;
                boxSpan.style.borderWidth = item.lineWidth + "px";
                boxSpan.style.display = "inline-block";
                boxSpan.style.borderRadius = "9999px";
                boxSpan.style.height = "6px";
                boxSpan.style.marginRight = "10px";
                boxSpan.style.width = "17px";

                const textContainer = document.createElement("span");
                textContainer.style.color = item.fontColor as string;
                textContainer.style.margin = "0";
                textContainer.style.padding = "0";

                const text = document.createTextNode(item.text);
                textContainer.appendChild(text);

                li.appendChild(boxSpan);
                li.appendChild(textContainer);

                if (showLinks) {
                    const linkContainer = document.createElement("a");
                    linkContainer.href = `/trigger/${item.text}`;
                    linkContainer.target = "_blank";
                    linkContainer.style.display = "flex";
                    linkContainer.style.textDecoration = "none";
                    linkContainer.style.marginLeft = "5px";

                    linkContainer.onclick = (event) => {
                        event.stopPropagation();
                    };

                    const linkImg = document.createElement("img");
                    linkImg.src = LinkIcon;
                    linkImg.style.height = "16px";
                    linkImg.style.width = "16px";

                    linkContainer.appendChild(linkImg);
                    li.appendChild(linkContainer);
                }

                ul.appendChild(li);
            });

            // Add collapse button if needed
            if (items.length > maxVisibleItems) {
                const collapseIcon = document.createElement("img");

                collapseIcon.style.height = "25px";
                collapseIcon.style.width = "25px";
                collapseIcon.style.cursor = "pointer";
                collapseIcon.style.marginLeft = "10px";
                collapseIcon.src = isExpanded ? ArrowUpIcon : ArrowDownIcon;

                collapseIcon.onclick = () => {
                    isExpanded = !isExpanded;
                    items.forEach((item, index) => {
                        const legendItem = ul.querySelector(
                            `#legend-item-${item.datasetIndex}`
                        ) as HTMLUListElement;
                        if (legendItem) {
                            legendItem.style.display =
                                index < maxVisibleItems || isExpanded ? "flex" : "none";
                        }
                    });
                    collapseIcon.src = isExpanded ? ArrowUpIcon : ArrowDownIcon;
                };

                ul.appendChild(collapseIcon);
            }
        }
    },
});
