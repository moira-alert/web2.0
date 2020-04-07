// @flow
import * as React from "react";
import flatten from "lodash/flatten";
import { Button } from "@skbkontur/react-ui/components/Button";
import OkIcon from "@skbkontur/react-icons/Ok";
import DeleteIcon from "@skbkontur/react-icons/Delete";
import TrashIcon from "@skbkontur/react-icons/Trash";
import ContactTypeIcon from "../ContactTypeIcon/ContactTypeIcon";
import type { Contact } from "../../Domain/Contact";
import type { TagStat } from "../../Domain/Tag";
import cn from "./TagList.less";

type Props = $Exact<{
    items: Array<TagStat>,
    contacts: Array<Contact>,
    onRemove: (tag: string) => void,
    onRemoveContact: (subscriptionId: string) => void,
}>;

export default function TagList(props: Props): React.Node {
    const { items, contacts, onRemove, onRemoveContact } = props;
    return (
        <div>
            <div className={cn("row", "header")}>
                <div className={cn("name")}>Tag</div>
                <div className={cn("trigger-counter")}>Triggers</div>
                <div className={cn("subscription-counter")}>Subscriptions</div>
                <div className={cn("control")} />
            </div>
            {items.map(item => (
                <TagListItem
                    key={item.name}
                    data={item}
                    allContacts={contacts}
                    onRemove={() => onRemove(item.name)}
                    onRemoveContact={id => onRemoveContact(id)}
                />
            ))}
        </div>
    );
}

type ItemProps = {
    data: TagStat,
    allContacts: Array<Contact>,
    onRemove: () => void,
    onRemoveContact: (subscriptionId: string) => void,
};
type ItemState = {
    showInfo: boolean,
};

class TagListItem extends React.Component<ItemProps, ItemState> {
    props: ItemProps;

    state: ItemState = {
        showInfo: false,
    };

    render(): React.Node {
        const { data, allContacts, onRemove, onRemoveContact } = this.props;
        const { showInfo } = this.state;
        const { name, subscriptions, triggers } = data;
        const isSubscriptions = subscriptions.length !== 0;
        return (
            <div className={cn("row", { active: showInfo, clicable: isSubscriptions })}>
                {isSubscriptions ? (
                    <button
                        type="button"
                        className={cn("name", "clicked")}
                        onClick={() => this.setState({ showInfo: !showInfo })}
                    >
                        {name}
                    </button>
                ) : (
                    <div className={cn("name")}>{name}</div>
                )}
                <div className={cn("trigger-counter")}>{triggers.length}</div>
                <div className={cn("subscription-counter")}>{subscriptions.length}</div>
                <div className={cn("control")}>
                    <Button use="link" icon={<TrashIcon />} onClick={() => onRemove()}>
                        Delete
                    </Button>
                </div>
                {showInfo && (
                    <div className={cn("info")}>
                        {isSubscriptions && (
                            <div className={cn("group")}>
                                {subscriptions.map(({ id, enabled, user, contacts }) => (
                                    <div key={id} className={cn("item")}>
                                        <div className={cn("enabled")}>
                                            {enabled ? <OkIcon /> : <DeleteIcon />}
                                        </div>
                                        <div className={cn("user")}>{user}</div>
                                        <div className={cn("contacts")}>
                                            {flatten(
                                                contacts.map(x =>
                                                    allContacts.filter(y => y.id === x)
                                                )
                                            ).map(({ id: contactId, type, value }) => (
                                                <div key={contactId}>
                                                    <ContactTypeIcon type={type} /> {value}
                                                </div>
                                            ))}
                                        </div>
                                        <div className={cn("sub-control")}>
                                            <Button
                                                use="link"
                                                icon={<TrashIcon />}
                                                onClick={() => onRemoveContact(id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }
}
