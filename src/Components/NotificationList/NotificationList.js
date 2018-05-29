// @flow
import * as React from "react";
import moment from "moment";
import Icon from "retail-ui/components/Icon";
import Gapped from "retail-ui/components/Gapped";
import Button from "retail-ui/components/Button";
import type { Notification } from "../../Domain/Notification";
import { getPageLink } from "../../Domain/Global";
import RouterLink from "../RouterLink/RouterLink";
import cn from "./NotificationList.less";

type Props = {|
    items: { [id: string]: Notification },
    onRemove: (key: string) => void,
    onRemoveAll: () => void,
    onRemoveEvents: () => void,
|};

export default function NotificationList(props: Props): React.Element<any> {
    const { items, onRemove, onRemoveAll, onRemoveEvents } = props;

    function renderContactIcon(type: string): React.Node {
        let name;
        switch (type) {
            case "telegram":
                name = "Telegram2";
                break;
            default:
                name = "Mail2";
                break;
        }
        return <Icon name={name} />;
    }

    return Object.keys(items).length === 0 ? (
        <div className={cn("no-result")}>Empty :-)</div>
    ) : (
        <Gapped gap={30} vertical>
            <div className={cn("row", "header")}>
                <div className={cn("timestamp")}>Timestamp</div>
                <div className={cn("trigger")}>Trigger</div>
                <div className={cn("contact")}>Contact</div>
                <div className={cn("throttled")}>Throttled</div>
                <div className={cn("fails")}>Fails</div>
                <div className={cn("remove")} />
            </div>
            {Object.keys(items).map((key, i) => {
                const { timestamp, trigger, contact, throttled, send_fail: fails } = items[key];
                const { type, value } = contact;
                const { id, name } = trigger;
                return (
                    <div key={i} className={cn("row")}>
                        <div className={cn("timestamp")}>{moment.unix(timestamp).format("MMMM D, HH:mm:ss")}</div>
                        <div className={cn("trigger")}>
                            <RouterLink to={getPageLink("trigger", id)}>{name}</RouterLink>
                        </div>
                        <div className={cn("contact")}>
                            {renderContactIcon(type)} {value}
                        </div>
                        <div className={cn("throttled", { true: throttled, false: !throttled })}>
                            {throttled ? <Icon name="Ok" /> : <Icon name="Delete" />}
                        </div>
                        <div className={cn("fails")}>{fails}</div>
                        <div className={cn("remove")}>
                            <Button use="link" icon="Trash" onClick={() => onRemove(key)}>
                                Remove
                            </Button>
                        </div>
                    </div>
                );
            })}
            <Gapped gap={15}>
                <Button icon="Trash" onClick={() => onRemoveAll()}>
                    Remove all notifications
                </Button>
                <Button icon="Trash" onClick={() => onRemoveEvents()}>
                    Remove all events
                </Button>
            </Gapped>
        </Gapped>
    );
}
