import { Notification } from "../Domain/Notification";
import { Status } from "../Domain/Status";

export function getAllStates(
    items: Record<string, Notification[]>
): { allPrevStates: Status[]; allCurrentStates: Status[] } {
    const prevStates = new Set<Status>();
    const currentStates = new Set<Status>();

    Object.values(items)
        .flat()
        .forEach(({ event }) => {
            if (event.old_state) prevStates.add(event.old_state);
            if (event.state) currentStates.add(event.state);
        });

    return {
        allPrevStates: Array.from(prevStates),
        allCurrentStates: Array.from(currentStates),
    };
}

const enum EStateFilters {
    state = "state",
    old_state = "old_state",
}

export const checkHasAllStates = (
    isStrictMatching: boolean,
    state: Status[],
    notifications: Notification[],
    field: EStateFilters
) => {
    return isStrictMatching
        ? state.every((status) => notifications.some((n) => n.event[field] === status))
        : state.length === 0 || notifications.some((n) => state.includes(n.event[field]));
};

export const checkHasAllStatesForValues = (
    isStrictMatching: boolean,
    stateFilter: Status[] | undefined,
    targetStates: Status[]
) => {
    if (!stateFilter || stateFilter.length === 0) return true;

    if (isStrictMatching) {
        return stateFilter.every((s) => targetStates.includes(s));
    } else {
        return stateFilter.some((s) => targetStates.includes(s));
    }
};
