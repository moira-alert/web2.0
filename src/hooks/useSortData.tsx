import { useCallback, useState, useMemo } from "react";
import orderBy from "lodash/orderBy";

type TSortingColumn = {
    sortingColumn: string;
};

export interface ISortConfig extends TSortingColumn {
    direction: "asc" | "desc";
}

export const useSortData = <T extends Record<string, unknown>>(
    data: T[],
    sortingColumn: string
) => {
    const [sortConfig, setSortConfig] = useState<ISortConfig>({
        sortingColumn,
        direction: "asc",
    });

    const sortedData = useMemo(() => {
        const sorted = orderBy(
            data,
            [
                (item) => {
                    const value = item[sortConfig.sortingColumn];

                    if (typeof value === "string") {
                        return value.toLowerCase();
                    } else if (Array.isArray(value)) {
                        return value.length;
                    }
                    return value;
                },
            ],
            [sortConfig.direction]
        );
        return sorted;
    }, [data, sortConfig]);

    const handleSort = useCallback(
        (sortingColumn: string) => {
            const direction = sortConfig.direction === "asc" ? "desc" : "asc";
            setSortConfig({ sortingColumn, direction } as ISortConfig);
        },
        [sortConfig]
    );

    return { sortedData, sortConfig, handleSort };
};
