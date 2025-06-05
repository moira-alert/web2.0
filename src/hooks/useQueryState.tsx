import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import qs from "qs";

type QueryValue = string | number | (string | number)[] | undefined;
type ParsedQueryValue = string | string[] | undefined;

export const useQueryState = <T extends QueryValue>(
    query: string,
    defaultValue: T
): [T, (value: T | null) => void] => {
    const location = useLocation();
    const navigate = useNavigate();

    const parseValue = (value: ParsedQueryValue): T => {
        if (value == null || value === undefined) {
            return defaultValue;
        }

        if (Array.isArray(defaultValue)) {
            return (Array.isArray(value) ? value : value.split(",")) as T;
        } else {
            return value.toString() as T;
        }
    };

    const queryValue = qs.parse(location.search, {
        ignoreQueryPrefix: true,
    })[query] as ParsedQueryValue;

    const stateValue = parseValue(queryValue);

    const setQuery = useCallback(
        (value: T | null) => {
            const existingQueries = qs.parse(location.search, { ignoreQueryPrefix: true });

            let serializedValue: T | null = value;

            if (Array.isArray(value)) {
                serializedValue = (value.length > 0 ? value.join(",") : null) as T | null;
            } else if (typeof value === "string") {
                serializedValue = (value.trim() !== "" ? value : null) as T | null;
            }

            const queryString = qs.stringify(
                {
                    ...existingQueries,
                    [query]: serializedValue,
                },
                { skipNulls: true }
            );

            navigate({ search: `?${queryString}` });
        },
        [location.search, query]
    );

    return [stateValue, setQuery];
};
