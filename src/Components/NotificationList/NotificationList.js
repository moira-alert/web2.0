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
import { MoiraStates } from "../../Domain/MoiraStatus";
import ToggleWithLabel from "../Toggle/Toggle";
import type { MoiraStatus } from "../../Domain/MoiraStatus";

type Props = {|
    items: { [id: string]: Notification },
    onRemove: (key: string) => void,
    onRemoveAll: () => void,
    onChangeNotifierState: (state: string) => void,
    notifier_state: MoiraStatus,
|};

export default function NotificationList(props: Props): React.Element<any> {
    const { items, onRemove, onRemoveAll, onChangeNotifierState, notifier_state } = props;

    const notification_actions = (
        <div className={cn("actions-row")}>
            <div className={cn("remove-notifications")}>
                <Button icon="Trash" onClick={() => onRemoveAll()}>
                    Remove all notifications
                </Button>
            </div>

            <div className={cn("switch-notifier-state")}>
                <ToggleWithLabel
                    label={notifier_state.state === MoiraStates.OK ? "Notifications enabled" : "Notifications disabled"}
                    checked={notifier_state.state === MoiraStates.OK}
                    onChange={checked => onChangeNotifierState(checked ? MoiraStates.OK : MoiraStates.ERROR)}
                />
            </div>
        </div>
    );

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
        notification_actions
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
            notification_actions
        </Gapped>
    );
}
