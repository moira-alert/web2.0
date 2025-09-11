import { OverrideField } from "../helpers/OverrideField";
import { MoiraScheduledNotification, DtoNotificationsList } from "./__generated__/data-contracts";
import { Event } from "./Event";

export type Notification = OverrideField<MoiraScheduledNotification, "event", Event>;

export type NotificationList = OverrideField<DtoNotificationsList, "list", Notification[]>;
