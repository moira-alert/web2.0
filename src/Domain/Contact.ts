import { format, fromUnixTime, startOfDay, startOfHour, startOfMinute } from "date-fns";
import { Status } from "./Status";
import { Subscription } from "./Subscription";

export enum ContactTypes {
    mail = "mail",
    email = "email",
    phone = "phone",
    pushover = "pushover",
    telegram = "telegram",
    msteams = "msteams",
    slack = "slack",
    "twilio sms" = "twilio sms",
    "twilio voice" = "twilio voice",
}

export enum EContactStatus {
    failed = "Failed",
    success = "Success",
}

export interface Contact {
    id: string;
    type: string;
    user?: string;
    value: string;
    team_id?: string;
    name?: string;
    extra_message?: string;
    score?: { last_err?: string; last_err_timestamp?: number; status?: EContactStatus };
}

export interface ContactWithEvents extends Contact {
    events_count: number;
}

export interface ContactNoisinessResponse {
    list: Array<ContactWithEvents>;
    page: number;
    size: number;
    total: number;
}

export type TeamContactCreateInfo = Omit<Contact, "id" | "user" | "score"> & {
    team_id: string;
};

export interface IContactEvent {
    timestamp: number;
    metric: string;
    state: Status;
    old_state: Status;
    trigger_id: string;
}

export enum EContactEventsInterval {
    minute = "minute",
    hour = "hour",
    day = "day",
}

export interface IContactEventsList {
    list: Array<IContactEvent>;
}

export interface ContactList {
    list: Array<Contact>;
}

export const filterSubscriptionContacts = (contacts: Contact[], subscription: Subscription) =>
    contacts.filter((contact) =>
        subscription.contacts.some((subscriptionContactId) => contact.id === subscriptionContactId)
    );

type Formatter = (timestamp: number) => string;

const formatString = "yyyy-MM-dd HH:mm";

const intervalToStartOfMapping: Record<EContactEventsInterval, Formatter> = {
    [EContactEventsInterval.day]: (timestamp) =>
        format(startOfDay(fromUnixTime(timestamp)), formatString),
    [EContactEventsInterval.minute]: (timestamp) =>
        format(startOfMinute(fromUnixTime(timestamp)), formatString),
    [EContactEventsInterval.hour]: (timestamp) =>
        format(startOfHour(fromUnixTime(timestamp)), formatString),
};

export const groupEventsByInterval = (events: IContactEvent[], interval: EContactEventsInterval) =>
    events
        .map(({ timestamp, old_state, state }) => [
            intervalToStartOfMapping[interval](timestamp),
            `${old_state} to ${state}`,
        ])
        .reduce((acc, [formattedDate, transition]) => {
            if (!acc[formattedDate]) {
                acc[formattedDate] = { [transition]: 1 };
            } else {
                if (!acc[formattedDate][transition]) {
                    acc[formattedDate][transition] = 0;
                }
                acc[formattedDate][transition] += 1;
            }

            return acc;
        }, {} as Record<string, Record<string, number>>);
