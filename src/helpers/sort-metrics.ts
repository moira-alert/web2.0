import type { MetricItemList } from "../Domain/Metric";
import { getStatusWeight } from "../Domain/Status";
import type { SortingColumn } from "../Components/MetricList/MetricList";

type SorterMap = {
    [key in SortingColumn]: (metrics: MetricItemList) => (x: string, y: string) => 1 | -1 | 0;
};

const compare = <T>(argA: T, argB: T) => {
    if (argA === argB) {
        return 0;
    }
    return argA < argB ? 1 : -1;
};

const sorterMap: SorterMap = {
    state: (metrics: MetricItemList) => (x: string, y: string) => {
        const stateA = getStatusWeight(metrics[x].state);
        const stateB = getStatusWeight(metrics[y].state);
        return compare(stateA, stateB);
    },
    name: () => (x: string, y: string) => {
        const regex = /[^a-zA-Z0-9-.]/g;
        const nameA = x.trim().replace(regex, "").toLowerCase();
        const nameB = y.trim().replace(regex, "").toLowerCase();
        return compare(nameA, nameB);
    },
    event: (metrics: MetricItemList) => (x: string, y: string) => {
        const eventA = metrics[x].event_timestamp || 0;
        const eventB = metrics[y].event_timestamp || 0;
        return compare(eventA, eventB);
    },
    value: (metrics: MetricItemList) => (x: string, y: string) => {
        const getValue = (value?: number) =>
            Number.isFinite(value) && value != null ? value : Number.MIN_SAFE_INTEGER;

        const xValues = metrics[x].values;
        const yValues = metrics[y].values;
        const xKeys = xValues ? Object.keys(xValues) : [];
        const yKeys = yValues ? Object.keys(yValues) : [];
        const maxKeysCount = Math.max(xKeys.length, yKeys.length);

        for (let i = 0; i < maxKeysCount; i += 1) {
            const valueA =
                xKeys.length > i && xValues ? getValue(xValues[xKeys[i]]) : Number.MIN_SAFE_INTEGER;
            const valueB =
                yKeys.length > i && yValues ? getValue(yValues[yKeys[i]]) : Number.MIN_SAFE_INTEGER;

            if (valueA !== valueB) {
                return valueA < valueB ? 1 : -1;
            }
        }
        return 0;
    },
};

export const sortMetrics = (
    metrics: MetricItemList,
    sortingColumn: SortingColumn,
    sortingDown: boolean
): MetricItemList => {
    const sorted = Object.keys(metrics).sort(sorterMap[sortingColumn](metrics));
    if (sortingDown) {
        sorted.reverse();
    }

    return sorted.reduce((data, key) => {
        data[key] = metrics[key];
        return data;
    }, {} as MetricItemList);
};
