import { Notification } from "../Domain/Notification";

export const composeNotifications = (
    items: Array<Notification>
): { [id: string]: Array<Notification> } => {
    return items.reduce((data: { [id: string]: Array<Notification> }, item: Notification) => {
        const id: string = item.timestamp + item.contact.id + item.event.sub_id;
        if (!data[id]) {
            data[id] = [];
        }
        data[id].push(item);
        return data;
    }, {});
};
