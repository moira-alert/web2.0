import { useEffect } from "react";

import { setError, toggleLoading } from "../store/Reducers/UIReducer.slice";
import { useGetTagStatsQuery } from "../services/TagsApi";
import { useDispatch } from "react-redux";
import { useGetAllContactsQuery } from "../services/ContactApi";

export const useLoadTagStatsData = () => {
    const dispatch = useDispatch();

    const {
        data: contacts,
        isLoading: isLoadingContacts,
        error: errorContacts,
    } = useGetAllContactsQuery();
    const {
        data: tagStats,
        isLoading: isLoadingTagStats,
        error: errorTagStats,
    } = useGetTagStatsQuery();

    useEffect(() => {
        const isLoading = isLoadingContacts || isLoadingTagStats;
        const error = errorContacts || errorTagStats;

        dispatch(toggleLoading(isLoading));
        dispatch(setError(error));
    }, [isLoadingContacts, isLoadingTagStats, errorContacts, errorTagStats]);

    return {
        contacts,
        tagStats,
    };
};
