import React, { useEffect, FC, useState } from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Gapped } from "@skbkontur/react-ui/components/Gapped";
import { Toggle } from "@skbkontur/react-ui/components/Toggle";
import TrashIcon from "@skbkontur/react-icons/Trash";
import MoiraApi from "../Api/MoiraApi";
import { withMoiraApi } from "../Api/MoiraApiInjection";
import MoiraServiceStates from "../Domain/MoiraServiceStates";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import NotificationList from "../Components/NotificationList/NotificationList";
import { ConfirmModal } from "../Components/ConfirmModal/ConfirmModal";
import { setDocumentTitle } from "../helpers/setDocumentTitle";
import { NotificationsState, UIState } from "../store/selectors";
import {
    deleteNotification,
    setNotifierEnabled,
    deleteAllNotifications,
} from "../store/Reducers/NotificationListContainerReducer.slice";
import {
    toggleLoading,
    toggleModal,
    setModalData,
    setError,
} from "../store/Reducers/UIReducer.slice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useLoadNotificationsData } from "../hooks/useLoadNotificationsData";
import { composeNotifications } from "../helpers/composeNotifications";

type TProps = { moiraApi: MoiraApi };

const NotificationListContainer: FC<TProps> = ({ moiraApi }) => {
    const dispatch = useAppDispatch();
    const { notificationList, notifierEnabled } = useAppSelector(NotificationsState);
    const { isLoading, error } = useAppSelector(UIState);
    const { loadNotificationsData } = useLoadNotificationsData(moiraApi);

    const [confirmModalAction, setConfirmModalAction] = useState<
        "turnOff" | "removeAllNotifications" | null
    >(null);

    const removeNotification = async (id: string) => {
        dispatch(toggleLoading(true));
        try {
            await moiraApi.delNotification(id);
            dispatch(deleteNotification(id));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(toggleLoading(false));
        }
    };

    const removeAllNotifications = async () => {
        dispatch(toggleModal(false));
        dispatch(toggleLoading(true));
        try {
            await moiraApi.delAllNotificationEvents();
            await moiraApi.delAllNotifications();
            dispatch(deleteAllNotifications());
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(toggleLoading(false));
        }
    };

    const toggleNotifier = async (enable: boolean) => {
        dispatch(toggleModal(false));
        dispatch(toggleLoading(true));
        try {
            const state = enable ? MoiraServiceStates.OK : MoiraServiceStates.ERROR;
            await moiraApi.setNotifierState({ state });
            dispatch(setNotifierEnabled(enable));
        } catch (error) {
            dispatch(setError(error.message));
        } finally {
            dispatch(toggleLoading(false));
        }
    };

    const handleDisableNotifier = () => {
        setConfirmModalAction("turnOff");
        dispatch(
            setModalData({
                header: "This action will turn off Moira notifications, are you sure?",
                button: {
                    text: "Turrn off",
                    use: "danger",
                },
            })
        );
        dispatch(toggleModal(true));
    };

    const onRemoveAllNotificationsBtnClick = () => {
        dispatch(
            setModalData({
                header: `Are you sure with deleting all ${notificationAmount} notifications?`,
                button: {
                    text: "Delete",
                    use: "danger",
                },
            })
        );
        setConfirmModalAction("removeAllNotifications");
        dispatch(toggleModal(true));
    };

    const notificationAmount = Array.isArray(notificationList) ? notificationList.length : "";
    const layoutTitle = `Notifications ${notificationAmount}`;

    useEffect(() => {
        setDocumentTitle("Notifications");
        loadNotificationsData();
    }, []);

    return (
        <Layout loading={isLoading} error={error}>
            <LayoutContent>
                <LayoutTitle>{layoutTitle}</LayoutTitle>
                <ConfirmModal
                    onConfirm={() =>
                        confirmModalAction === "removeAllNotifications"
                            ? removeAllNotifications()
                            : toggleNotifier(false)
                    }
                />
                <Gapped gap={30}>
                    <Toggle
                        checked={notifierEnabled}
                        onValueChange={(value) =>
                            value ? toggleNotifier(value) : handleDisableNotifier()
                        }
                    >
                        Notifications
                    </Toggle>
                    <Button
                        use={"link"}
                        icon={<TrashIcon />}
                        onClick={onRemoveAllNotificationsBtnClick}
                    >
                        Remove all
                    </Button>
                </Gapped>
                <br />
                {notificationList && (
                    <NotificationList
                        items={composeNotifications(notificationList)}
                        onRemove={removeNotification}
                    />
                )}
            </LayoutContent>
        </Layout>
    );
};

export default withMoiraApi(NotificationListContainer);
