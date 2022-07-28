import type { Metric } from "../Domain/Metric";
import { getStatusWeight } from "../Domain/Status";
import type { SortingColumn } from "../Components/MetricList/MetricList";

type SorterMap = {
    [key in SortingColumn]: (x: string, y: string) => 1 | -1 | 0;
};

export const sortMetrics = (
    metrics: {
        [metric: string]: Metric;
    },
    sortingColumn: SortingColumn,
    sortingDown: boolean
): { [metric: string]: Metric } => {
    const sorterMap: SorterMap = {
        state: (x: string, y: string) => {
            const stateA = getStatusWeight(metrics[x].state);
            const stateB = getStatusWeight(metrics[y].state);
            if (stateA === stateB) {
                return 0;
            }
            return stateA < stateB ? 1 : -1;
        },
        name: (x: string, y: string) => {
            const regex = /[^a-zA-Z0-9-.]/g;
            const nameA = x.trim().replace(regex, "").toLowerCase();
            const nameB = y.trim().replace(regex, "").toLowerCase();
            if (nameA === nameB) {
                return 0;
            }
            return nameA < nameB ? 1 : -1;
        },
        event: (x: string, y: string) => {
            const eventA = metrics[x].event_timestamp || 0;
            const eventB = metrics[y].event_timestamp || 0;
            if (eventA === eventB) {
                return 0;
            }
            return eventA < eventB ? 1 : -1;
        },
        value: (x: string, y: string) => {
            const getValue = (value?: number) =>
                Number.isFinite(value) && value != null ? value : Number.MIN_SAFE_INTEGER;

            const xValues = metrics[x].values;
            const yValues = metrics[y].values;
            const xKeys = xValues ? Object.keys(xValues) : [];
            const yKeys = yValues ? Object.keys(yValues) : [];
            const maxKeysCount = Math.max(xKeys.length, yKeys.length);

            for (let i = 0; i < maxKeysCount; i += 1) {
                const valueA =
                    xKeys.length > i && xValues
                        ? getValue(xValues[xKeys[i]])
                        : Number.MIN_SAFE_INTEGER;
                const valueB =
                    yKeys.length > i && yValues
                        ? getValue(yValues[yKeys[i]])
                        : Number.MIN_SAFE_INTEGER;

                if (valueA !== valueB) {
                    return valueA < valueB ? 1 : -1;
                }
            }
            return 0;
        },
    };

    const sorted = Object.keys(metrics).sort(sorterMap[sortingColumn]);
    if (sortingDown) {
        sorted.reverse();
    }

    return sorted.reduce((data, key) => ({ ...data, [key]: metrics[key] }), {});
};
