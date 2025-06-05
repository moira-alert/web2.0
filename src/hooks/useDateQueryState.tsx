import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import qs from "qs";
import { getUnixTime, fromUnixTime } from "date-fns";

export const useDateQueryState = (
    query: string,
    defaultValue: Date | null
): [Date | null, (value: Date | null) => void] => {
    const location = useLocation();
    const navigate = useNavigate();

    const parseDateValue = (value: string): Date => {
        if (defaultValue) return defaultValue;
        return fromUnixTime(Number(value));
    };

    const queryValue = qs.parse(location.search, { ignoreQueryPrefix: true })[query];

    const stateValue = queryValue ? parseDateValue(queryValue as string) : null;

    const setDateQuery = useCallback(
        (value: Date | null) => {
            const existingQueries = qs.parse(location.search, { ignoreQueryPrefix: true });

            const dateToUnixTimestamp = value && getUnixTime(value);

            const queryString = qs.stringify(
                {
                    ...existingQueries,
                    [query]: dateToUnixTimestamp,
                },
                { skipNulls: true }
            );

            navigate({ search: `?${queryString}` }, { replace: false });
        },
        [location.search]
    );

    return [stateValue, setDateQuery];
};
