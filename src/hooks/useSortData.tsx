import { useCallback, useState, useMemo } from "react";

type TSortingColumn = {
    sortingColumn: string;
};

export interface ISortConfig extends TSortingColumn {
    direction: "ascending" | "descending";
}

const compare = <T extends Record<string, unknown>>(
    a: T,
    b: T,
    sortConfig: ISortConfig
): number => {
    const argA = a[sortConfig.sortingColumn];
    const argB = b[sortConfig.sortingColumn];

    const isArray = Array.isArray(argA);

    if (isArray) {
        return sortConfig.direction === "ascending"
            ? (argA as T[]).length - (argB as T[]).length
            : (argB as T[]).length - (argA as T[]).length;
    }

    const collator = new Intl.Collator();
    return sortConfig.direction === "ascending"
        ? collator.compare(argA as string, argB as string)
        : collator.compare(argB as string, argA as string);
};

export const useSortData = <T extends Record<string, unknown>>(
    data: T[],
    sortingColumn: string
) => {
    const [sortConfig, setSortConfig] = useState<ISortConfig>({
        sortingColumn,
        direction: "ascending",
    });

    const sortedData = useMemo(() => {
        const sortableData = [...data];
        if (sortConfig !== null) {
            sortableData.sort((a, b) => compare(a, b, sortConfig));
        }
        return sortableData;
    }, [data, sortConfig]);

    const handleSort = useCallback(
        (sortingColumn: string) => {
            const direction = sortConfig.direction === "ascending" ? "descending" : "ascending";
            setSortConfig({ sortingColumn, direction } as ISortConfig);
        },
        [sortConfig]
    );

    return { sortedData, sortConfig, handleSort };
};
