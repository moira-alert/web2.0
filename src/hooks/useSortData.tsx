import { useCallback, useState, useMemo } from "react";
import orderBy from "lodash/orderBy";

type TSortingColumn = {
    sortingColumn: string;
};

export interface ISortConfig extends TSortingColumn {
    direction: "asc" | "desc";
}
export type ValueResolver<T extends object> = <K extends keyof T>(
    item: T,
    column: K
) => string | number | (string | number)[];

export const useSortData = <T extends object>(
    data: T[],
    sortingColumn: keyof T,
    valueResolver?: ValueResolver<T>
) => {
    const [sortConfig, setSortConfig] = useState<{
        sortingColumn: keyof T;
        direction: "asc" | "desc";
    }>({
        sortingColumn,
        direction: "asc",
    });

    const sortedData = useMemo(() => {
        const getter = (item: T) => {
            const value = valueResolver
                ? valueResolver(item, sortConfig.sortingColumn)
                : item[sortConfig.sortingColumn];

            if (typeof value === "string") {
                return value.toLowerCase();
            }

            if (Array.isArray(value)) {
                return value.length;
            }
            return value;
        };

        const sorted = orderBy([...data], [getter], [sortConfig.direction]);
        return sorted;
    }, [data, sortConfig]);

    const handleSort = useCallback(
        (sortingColumn: keyof T) => {
            const direction = sortConfig.direction === "asc" ? "desc" : "asc";
            setSortConfig({ sortingColumn, direction });
        },
        [sortConfig]
    );

    return { sortedData, sortConfig, handleSort };
};
