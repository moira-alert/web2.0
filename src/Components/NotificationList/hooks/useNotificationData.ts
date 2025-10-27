import { uniq } from "lodash";
import { useMemo } from "react";
import { Notification } from "../../../Domain/Notification";
import { TNotificationListProps } from "../NotificationList";
import { getAllStates } from "../../../helpers/notificationFilters";
import { INotificationRow, useNotificationColumns } from "./useNotificationColumns";

export const useNotificationData = ({
    items,
    handleClickActionsBtn,
}: {
    items: TNotificationListProps["items"];
    handleClickActionsBtn: (id: string) => void;
}) => {
    const data = useMemo(() => transformNotificationData(items), [items]);

    const { allPrevStates, allCurrentStates } = useMemo(() => getAllStates(items), [items]);

    const allClusterKeys = useMemo(() => uniq(data.map((d) => d.clusterKey).filter((key) => key)), [
        data,
    ]);

    const columns = useNotificationColumns({
        allCurrentStates,
        allPrevStates,
        allClusterKeys,
        handleClickActionsBtn,
    });

    return { data, columns };
};

const transformNotificationData = (items: TNotificationListProps["items"]): INotificationRow[] => {
    return Object.keys(items).map((key) => {
        const group = items[key];
        const { timestamp, trigger, contact, throttled, send_fail: fails } = group[0];

        return {
            id: key,
            timestamp,
            state: createStateData(group),
            trigger,
            user: contact.user,
            team: contact.team,
            contact,
            throttled,
            fails,
            clusterKey: `${group[0].trigger.trigger_source} ${group[0].trigger.cluster_id}`,
            count: group.length,
        };
    });
};

const createStateData = (group: Notification[]) => {
    return {
        prev: uniq(group.map((n) => n.event.old_state)),
        curr: uniq(group.map((n) => n.event.state)),
    };
};
