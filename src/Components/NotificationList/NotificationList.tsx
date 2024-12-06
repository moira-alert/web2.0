import React, { useState, useRef } from "react";
import { format, fromUnixTime } from "date-fns";
import OkIcon from "@skbkontur/react-icons/Ok";
import DeleteIcon from "@skbkontur/react-icons/Delete";
import TrashIcon from "@skbkontur/react-icons/Trash";
import { Flexbox } from "../Flexbox/FlexBox";
import { Button } from "@skbkontur/react-ui/components/Button";
import ArrowBoldRightIcon from "@skbkontur/react-icons/ArrowBoldRight";
import uniq from "lodash/uniq";
import { Notification } from "../../Domain/Notification";
import { ConfirmModalHeaderData, getPageLink } from "../../Domain/Global";
import { Link } from "@skbkontur/react-ui/components/Link";
import ContactTypeIcon from "../ContactTypeIcon/ContactTypeIcon";
import StatusIndicator from "../StatusIndicator/StatusIndicator";
import useConfirmModal from "../../hooks/useConfirmModal";
import { Tooltip } from "@skbkontur/react-ui/components/Tooltip";
import classNames from "classnames/bind";

import styles from "./NotificationList.less";

const cn = classNames.bind(styles);

interface ContactNameWithTooltipProps {
    type: string;
    value: string;
    name?: string;
}

const ContactNameWithTooltip: React.FC<ContactNameWithTooltipProps> = ({ type, value, name }) => {
    const contactNameRef = useRef<HTMLDivElement | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    const handleMouseEnter = () => {
        if (contactNameRef.current) {
            const isOverflowing =
                contactNameRef.current.scrollWidth > contactNameRef.current.offsetWidth;
            setShowTooltip(isOverflowing);
        }
    };

    return (
        <>
            <ContactTypeIcon type={type} />
            <Tooltip render={() => (showTooltip ? `${value}${name ? ` (${name})` : ""}` : null)}>
                <div
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={() => setShowTooltip(false)}
                    ref={contactNameRef}
                    className={cn("contact-name")}
                >
                    &nbsp;
                    {value}
                    &nbsp;
                    {name && `(${name})`}
                </div>
            </Tooltip>
        </>
    );
};

type Props = {
    items: {
        [id: string]: Array<Notification>;
    };
    onRemove: (key: string) => void;
};

export default function NotificationList(props: Props): React.ReactElement {
    const { items, onRemove } = props;

    const [ConfirmModal, setModalData] = useConfirmModal();

    const handleDeleteNotification = (notificationId: string) => {
        setModalData({ isOpen: false });
        onRemove(notificationId);
    };

    const handleClickRemoveBtn = async (notificationId: string) => {
        setModalData({
            isOpen: true,
            header: ConfirmModalHeaderData.deleteNotification,
            button: {
                text: "Delete",
                use: "danger",
                onConfirm: () => handleDeleteNotification(notificationId),
            },
        });
    };

    return Object.keys(items).length === 0 ? (
        <div className={cn("no-result")}>Empty :-)</div>
    ) : (
        <>
            {ConfirmModal}
            <Flexbox gap={30}>
                <div className={cn("row", "italic-font")}>
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
                    const { type, value, name: contactName, user } = contact;
                    const { id, name: triggerName } = trigger;
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
                                    <Link href={getPageLink("trigger", id)}>{triggerName}</Link>
                                ) : (
                                    <span>&mdash;</span>
                                )}
                            </div>
                            <div className={cn("user")}>{user}</div>
                            <div className={cn("contact")}>
                                <ContactNameWithTooltip
                                    type={type}
                                    value={value}
                                    name={contactName}
                                />
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
            </Flexbox>
        </>
    );
}
