import * as React from "react";
import { format, fromUnixTime } from "date-fns";
import OkIcon from "@skbkontur/react-icons/Ok";
import DeleteIcon from "@skbkontur/react-icons/Delete";
import TrashIcon from "@skbkontur/react-icons/Trash";
import { Gapped } from "@skbkontur/react-ui/components/Gapped";
import { Button } from "@skbkontur/react-ui/components/Button";
import ArrowBoldRightIcon from "@skbkontur/react-icons/ArrowBoldRight";
import uniq from "lodash/uniq";
import { Notification } from "../../Domain/Notification";
import { ConfirmModalHeaderData, getPageLink } from "../../Domain/Global";
import RouterLink from "../RouterLink/RouterLink";
import ContactTypeIcon from "../ContactTypeIcon/ContactTypeIcon";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
import { ConfirmModal } from "../ConfirmModal/ConfirmModal";
import { useAppDispatch } from "../../store/hooks";
import { toggleModal, setModalData } from "../../store/Reducers/UIReducer.slice";
import classNames from "classnames/bind";

import styles from "./NotificationList.less";

const cn = classNames.bind(styles);

type Props = {
    items: {
        [id: string]: Array<Notification>;
    };
    onRemove: (key: string) => void;
};

export default function NotificationList(props: Props): React.ReactElement {
    const { items, onRemove } = props;

    const [notificationId, setNotificationId] = React.useState("");
    const dispatch = useAppDispatch();

    const handleDeleteNotification = async () => {
        dispatch(toggleModal(false));
        await onRemove(notificationId);
    };

    const handleClickRemoveBtn = async (key: string) => {
        setNotificationId(key);
        dispatch(
            setModalData({
                header: ConfirmModalHeaderData.deleteNotification,
                button: {
                    text: "Delete",
                    use: "danger",
                },
            })
        );
        dispatch(toggleModal(true));
    };

    return Object.keys(items).length === 0 ? (
        <div className={cn("no-result")}>Empty :-)</div>
    ) : (
        <>
            <ConfirmModal onConfirm={handleDeleteNotification} />
            <Gapped gap={30} vertical>
                <div className={cn("row", "header")}>
                    <div className={cn("timestamp")}>Timestamp</div>
                    <div className={cn("state")}>State</div>
                    <div className={cn("trigger")}>Trigger</div>
                    <div className={cn("user")}>User</div>
                    <div className={cn("contact")}>Contact</div>
                    <div className={cn("throttled")}>Throttled</div>
                    <div className={cn("fails")}>Fails</div>
                    <div className={cn("remove")} />
                </div>
                {Object.keys(items).map((key) => {
                    const { timestamp, trigger, contact, throttled, send_fail: fails } = items[
                        key
                    ][0];
                    const { type, value, user } = contact;
                    const { id, name } = trigger;
                    return (
                        <div key={key} className={cn("row")}>
                            <div className={cn("timestamp")}>
                                {format(fromUnixTime(timestamp), "MMMM d, HH:mm:ss")}
                                {items[key].length > 1 ? ` (${items[key].length}×)` : ""}
                            </div>
                            <div className={cn("state")}>
                                <div className={cn("prev-state")}>
                                    <StatusIndicator
                                        statuses={uniq(items[key].map((n) => n.event.old_state))}
                                        size={14}
                                    />
                                </div>
                                <div className={cn("arrow")}>
                                    <ArrowBoldRightIcon />
                                </div>
                                <div className={cn("curr-state")}>
                                    <StatusIndicator
                                        statuses={uniq(items[key].map((n) => n.event.state))}
                                        size={14}
                                    />
                                </div>
                            </div>
                            <div className={cn("trigger")}>
                                {id ? (
                                    <RouterLink to={getPageLink("trigger", id)}>{name}</RouterLink>
                                ) : (
                                    <span>&mdash;</span>
                                )}
                            </div>
                            <div className={cn("user")}>{user}</div>
                            <div className={cn("contact")}>
                                <ContactTypeIcon type={type} /> {value}
                            </div>
                            <div
                                className={cn("throttled", { true: throttled, false: !throttled })}
                            >
                                {throttled ? <OkIcon /> : <DeleteIcon />}
                            </div>
                            <div className={cn("fails")}>{fails}</div>
                            <div className={cn("remove")}>
                                <Button
                                    use="link"
                                    icon={<TrashIcon />}
                                    onClick={() => handleClickRemoveBtn(key)}
                                >
                                    Remove
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </Gapped>
        </>
    );
}
