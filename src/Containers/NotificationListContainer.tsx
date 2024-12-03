import React, { useEffect, FC } from "react";
import { Button } from "@skbkontur/react-ui/components/Button";
import { Flexbox } from "../Components/Flexbox/FlexBox";
import { Toggle } from "@skbkontur/react-ui/components/Toggle";
import TrashIcon from "@skbkontur/react-icons/Trash";
import MoiraServiceStates from "../Domain/MoiraServiceStates";
import { Layout, LayoutContent, LayoutTitle } from "../Components/Layout/Layout";
import NotificationList from "../Components/NotificationList/NotificationList";
import { setDocumentTitle } from "../helpers/setDocumentTitle";
import { UIState } from "../store/selectors";
import { useAppSelector } from "../store/hooks";
import { useLoadNotificationsData } from "../hooks/useLoadNotificationsData";
import { composeNotifications } from "../helpers/composeNotifications";
import { ConfirmModalHeaderData } from "../Domain/Global";
import useConfirmModal from "../hooks/useConfirmModal";
import {
    useDeleteAllNotificationEventsMutation,
    useDeleteAllNotificationsMutation,
    useDeleteNotificationMutation,
} from "../services/NotificationsApi";
import { useSetNotifierStateMutation } from "../services/NotifierApi";

const NotificationListContainer: FC = () => {
    const { isLoading, error } = useAppSelector(UIState);
    const { notifierEnabled, notificationList, notificationAmount } = useLoadNotificationsData();
    const [deleteNotification] = useDeleteNotificationMutation();
    const [deleteAllNotifications] = useDeleteAllNotificationsMutation();
    const [deleleteAllNotificationEvents] = useDeleteAllNotificationEventsMutation();
    const [setNotifierState] = useSetNotifierStateMutation();
    const [ConfirmModal, setModalData] = useConfirmModal();

    const layoutTitle = `Notifications ${notificationAmount}`;

    const removeAllNotifications = async () => {
        setModalData({ isOpen: false });
        deleteAllNotifications();
        deleleteAllNotificationEvents();
    };

    const toggleNotifier = async (enable: boolean) => {
        setModalData({ isOpen: false });
        const state = enable ? MoiraServiceStates.OK : MoiraServiceStates.ERROR;
        setNotifierState({ state });
    };

    const handleDisableNotifier = () => {
        setModalData({
            isOpen: true,
            header: ConfirmModalHeaderData.moiraTurnOff,
            button: {
                text: "Turrn off",
                use: "danger",
                onConfirm: () => toggleNotifier(false),
            },
        });
    };

    const onRemoveAllNotificationsBtnClick = () => {
        notificationAmount &&
            setModalData({
                isOpen: true,
                header: ConfirmModalHeaderData.deleteAllNotifications(notificationAmount),
                button: {
                    text: "Delete",
                    use: "danger",
                    onConfirm: removeAllNotifications,
                },
            });
    };

    useEffect(() => {
        setDocumentTitle("Notifications");
    }, []);

    return (
        <Layout loading={isLoading} error={error}>
            <LayoutContent>
                <LayoutTitle>{layoutTitle}</LayoutTitle>
                {ConfirmModal}
                <Flexbox align="baseline" direction="row" gap={30}>
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
                </Flexbox>
                <br />
                {notificationList && (
                    <NotificationList
                        items={composeNotifications(notificationList)}
                        onRemove={(id) => deleteNotification({ id })}
                    />
                )}
            </LayoutContent>
        </Layout>
    );
};

export default NotificationListContainer;
