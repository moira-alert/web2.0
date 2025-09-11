import { format, fromUnixTime, startOfDay, startOfHour, startOfMinute } from "date-fns";
import { Subscription } from "./Subscription";

import type {
    DtoContactWithScore,
    DtoContactNoisinessList,
    DtoContactEventItem,
    DtoContactEventItemList,
    DtoTeamContactWithScore,
    DtoContactList,
} from "./__generated__/data-contracts";

export type Contact = DtoContactWithScore;
export type ContactNoisinessResponse = DtoContactNoisinessList;
export type IContactEvent = DtoContactEventItem;
export type IContactEventsList = DtoContactEventItemList;
export type ITeamContactWithScore = DtoTeamContactWithScore;
export type ContactList = DtoContactList;

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

export enum EContactEventsInterval {
    minute = "minute",
    hour = "hour",
    day = "day",
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
