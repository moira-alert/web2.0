import { useDispatch } from "react-redux";
import { toggleLoading } from "../store/Reducers/UIReducer.slice";
import MoiraApi from "../Api/MoiraApi";
import {
    setNotificationList,
    setNotifierEnabled,
} from "../store/Reducers/NotificationListContainerReducer.slice";
import { setError } from "../store/Reducers/UIReducer.slice";
import MoiraServiceStates from "../Domain/MoiraServiceStates";

export const useLoadNotificationsData = (moiraApi: MoiraApi) => {
    const dispatch = useDispatch();

    const loadNotificationsData = async () => {
        dispatch(toggleLoading(true));
        try {
            const { list } = await moiraApi.getNotificationList();
            dispatch(setNotificationList(list));
            const notifier = await moiraApi.getNotifierState();
            dispatch(setNotifierEnabled(notifier?.state === MoiraServiceStates.OK));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(toggleLoading(false));
        }
    };

    return { loadNotificationsData };
};
