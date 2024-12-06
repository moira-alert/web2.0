import MoiraServiceStates from "../Domain/MoiraServiceStates";
import { useGetNotificationsQuery } from "../services/NotificationsApi";
import { useGetNotifierStateQuery } from "../services/NotifierApi";

export const useLoadNotificationsData = () => {
    const { data: notifier } = useGetNotifierStateQuery();
    const { data: notifications } = useGetNotificationsQuery();

    return {
        notifierEnabled: notifier?.state === MoiraServiceStates.OK,
        notificationList: notifications?.list,
        notificationAmount: notifications?.total ?? 0,
    };
};
