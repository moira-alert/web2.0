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

export function filterNotifications(
    items: Record<string, Notification[]>,
    prevStateFilter: Status[],
    currentStateFilter: Status[],
    isStrictMatching: boolean
): { filteredItems: typeof items; filteredCount: number } {
    const result: typeof items = {};
    let count = 0;

    for (const [key, notifications] of Object.entries(items)) {
        const hasAllPrevStates = isStrictMatching
            ? prevStateFilter.every((status) =>
                  notifications.some((n) => n.event.old_state === status)
              )
            : prevStateFilter.length === 0 ||
              notifications.some((n) => prevStateFilter.includes(n.event.old_state));

        const hasAllCurrentStates = isStrictMatching
            ? currentStateFilter.every((status) =>
                  notifications.some((n) => n.event.state === status)
              )
            : currentStateFilter.length === 0 ||
              notifications.some((n) => currentStateFilter.includes(n.event.state));

        if (hasAllPrevStates && hasAllCurrentStates) {
            result[key] = notifications;
            count += notifications.length;
        }
    }

    return { filteredItems: result, filteredCount: count };
}
