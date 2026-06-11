import { useNavigate } from "react-router";
import { MoiraUrlParams } from "../../Domain/MoiraUrlParams";
import { TriggerListUpdate } from "./trigger-list";
import qs from "qs";
import { TriggerList } from "../../Domain/Trigger";
import { clearInput } from "../../helpers/common";

const getStoredTriggerListSettings = (): Partial<TriggerListUpdate> => {
    const localDataString = localStorage.getItem("moiraSettings");

    if (!localDataString) {
        return {};
    }

    try {
        return JSON.parse(localDataString);
    } catch {
        return {};
    }
};

const getMissingSearchParams = (
    tags: string[],
    onlyProblems: boolean,
    storedSettings: Partial<TriggerListUpdate>
): Partial<TriggerListUpdate> => {
    const update: Partial<TriggerListUpdate> = {};

    if (tags.length === 0 && storedSettings.tags?.length) {
        update.tags = storedSettings.tags;
    }

    if (!onlyProblems && storedSettings.onlyProblems) {
        update.onlyProblems = storedSettings.onlyProblems;
    }

    return update;
};

export const shouldSyncSearchParamsWithStorage = (
    navigate: ReturnType<typeof useNavigate>,
    locationSearch: MoiraUrlParams,
    tags: string[],
    onlyProblems: boolean
): boolean => {
    const storedSettings = getStoredTriggerListSettings();

    const searchToUpdate = getMissingSearchParams(tags, onlyProblems, storedSettings);

    if (Object.keys(searchToUpdate).length === 0) {
        return false;
    }

    changeLocationSearch(navigate, locationSearch, searchToUpdate);

    return true;
};

export const changeLocationSearch = (
    navigate: ReturnType<typeof useNavigate>,
    locationSearch: MoiraUrlParams,
    update: TriggerListUpdate
) => {
    const settings = { ...locationSearch, ...update };
    localStorage.setItem("moiraSettings", JSON.stringify({ ...settings, searchText: "" }));
    navigate(`?${qs.stringify(settings, { arrayFormat: "indices", encode: true })}`, {
        replace: true,
    });
};

export const redirectIfPageOutOfRange = (
    triggerList: TriggerList,
    page: number,
    onChange: (update: TriggerListUpdate) => void
) => {
    const pages = Math.ceil((triggerList?.total ?? 0) / (triggerList?.size ?? 1));
    if (page > pages && triggerList.total !== 0) {
        onChange({ page: pages || 1 });
        return true;
    }
    return false;
};

export const parseLocationSearch = (search: string): MoiraUrlParams => {
    const START_PAGE = 1;
    const { page, tags, onlyProblems, searchText, teamID } = qs.parse(search, {
        ignoreQueryPrefix: true,
    });

    return {
        page:
            Number.isNaN(Number(page)) || typeof page !== "string"
                ? START_PAGE
                : Math.abs(parseInt(page, 10)),
        tags: Array.isArray(tags) ? tags.map((value) => value.toString()) : [],
        onlyProblems: onlyProblems === "false" ? false : Boolean(onlyProblems),
        searchText: clearInput(typeof searchText === "string" ? searchText : ""),
        teamID: teamID?.toString(),
    };
};
