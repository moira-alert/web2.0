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

const checkHasAllStates = (
    isStrictMatching: boolean,
    state: Status[],
    notifications: Notification[]
) => {
    return isStrictMatching
        ? state.every((status) => notifications.some((n) => n.event.old_state === status))
        : state.length === 0 || notifications.some((n) => state.includes(n.event.old_state));
};

export function filterNotifications(
    items: Record<string, Notification[]>,
    prevStateFilter: Status[],
    currentStateFilter: Status[],
    isStrictMatching: boolean
): { filteredItems: typeof items; filteredCount: number } {
    const result: typeof items = {};
    let count = 0;

    for (const [key, notifications] of Object.entries(items)) {
        const hasAllPrevStates = checkHasAllStates(
            isStrictMatching,
            prevStateFilter,
            notifications
        );

        const hasAllCurrentStates = checkHasAllStates(
            isStrictMatching,
            currentStateFilter,
            notifications
        );

        if (hasAllPrevStates && hasAllCurrentStates) {
            result[key] = notifications;
            count += notifications.length;
        }
    }

    return { filteredItems: result, filteredCount: count };
}
